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
import { APP_NAME } from './app-config';



export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const expRestApi = new RestApi(this, `${APP_NAME}RestApi`);

    expRestApi.addEndpoint(
      `${APP_NAME}ExpEndpoint1`,
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

    const restApi = new RestApi(this, `${APP_NAME}Api`);

    // not sure if I need to change this id ?
    const existingTable = new CosmosTable(this, 'ExistingMultienvTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    restApi.addEndpoint(
      `${APP_NAME}point1`,
      new EndpointWithNodejsLambdaProps({
        httpMethod: HttpMethod.GET,
        path: '/hello1',
        function: {
          entry: join(__dirname, '../lambda/bff1/app.ts'),
          handler: 'handler',
        },
        attachAuthorizer: false,
        //  Each table id will be added as an env var to the lambda in the format of DDB_TABLE_${tableId}
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
      `${APP_NAME}point2`,
      new EndpointWithNodejsLambdaProps({
        httpMethod: HttpMethod.GET,
        path: '/hello2',
        function: {
          entry: join(__dirname, '../lambda/bff2/app.ts'),
          handler: 'handler',
        },
        attachAuthorizer: false,
        secretNames: ['Multienv'],
        // Chicken egg problem - uncomment after first deploy
        // downstreamRestApiNames: [expRestApi.node.id],
      })
    );
  }
}

export class StaticContentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stageName = getStageName(this);

    new StaticWebContent(this, `${APP_NAME}StaticWebContent`, {
      name: `${APP_NAME}-StaticWebContent`,
      targetBucketId: dplatEnv(this).targetBucketId,
      source: join(__dirname, `../dist/${stageName.toLowerCase()}`),
    });
  }
}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const apiStack = new ApiStack(this, `${APP_NAME}ApiStack`, {
      env: dplatEnv(this, id).default,
    });

    const staticContentStack = new StaticContentStack(this, `${APP_NAME}StaticStack`, {
      env: dplatEnv(this, id).static,
    });

    applyCompliance(apiStack);
    applyCompliance(staticContentStack);
  }
}
