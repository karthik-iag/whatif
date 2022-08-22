import { applyCompliance } from '@cosmos/cdk-compliance';
import { join } from 'path';
import { Stack, StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  EndpointWithNodejsLambdaProps,
  HttpMethod,
  RestApi,
  StaticWebContent,
  CosmosTable,
} from '@cosmos/cdk-patterns';
import { dplatEnv, getStageName } from '@cosmos/cdk-patterns/lib/utils';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const expRestApi = new RestApi(this, 'MultienvExpApi');

    expRestApi.addEndpoint(
      'MultienvExpEndpoint1',
      new EndpointWithNodejsLambdaProps({
        httpMethod: HttpMethod.GET,
        path: '/message',
        function: {
          entry: join(__dirname, '../lambda/experience/app.ts'),
          handler: 'handler',
        },
        attachAuthorizer: false,
        addNewRelicLayer: false,
      })
    );

    const restApi = new RestApi(this, 'MultienvApi');

    const existingTable = new CosmosTable(this, 'ExistingMultienvTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    restApi.addEndpoint(
      'MultienvEndpoint1',
      new EndpointWithNodejsLambdaProps({
        httpMethod: HttpMethod.GET,
        path: '/hello1',
        function: {
          entry: join(__dirname, '../lambda/bff1/app.ts'),
          handler: 'handler',
        },
        attachAuthorizer: false,
        tables: {
          multienv: {
            partitionKey: { name: 'id', type: AttributeType.STRING },
          },
        },
        existingTables: {
          existingmultienvtable: existingTable.table,
        },
      })
    );

    restApi.addEndpoint(
      'MultienvEndpoint2',
      new EndpointWithNodejsLambdaProps({
        httpMethod: HttpMethod.GET,
        path: '/hello2',
        function: {
          entry: join(__dirname, '../lambda/bff2/app.ts'),
          handler: 'handler',
        },
        attachAuthorizer: false,
        secretNames: ['Multienv'],
        downstreamRestApiNames: [expRestApi.node.id],
      })
    );
  }
}

export class StaticContentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stageName = getStageName(this);

    new StaticWebContent(this, 'MultienvSite', {
      name: 'REPLACE-ME',
      targetBucketId: dplatEnv(this).targetBucketId,
      source: join(__dirname, `../dist/${stageName.toLowerCase()}`),
    });
  }
}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const appName = "REPLACE-ME";

    const apiStack = new ApiStack(this, `${appName}ApiStack`, {
      env: dplatEnv(this, id).default,
    });

    const staticContentStack = new StaticContentStack(this, `${appName}StaticStack`, {
      env: dplatEnv(this, id).static,
    });

    applyCompliance(apiStack);
    applyCompliance(staticContentStack);
  }
}
