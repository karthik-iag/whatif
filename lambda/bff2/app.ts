import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import got from 'got';
import { HttpsProxyAgent } from 'hpagent';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));

  const stageName = process.env.STAGE_NAME;

  const secretArn = process.env.MULTIENV_SECRET_ARN;

  if (!secretArn) {
    throw new Error('Unable to find environment variable named MULTIENV_SECRET_ARN');
  }

  const proxy = `http://${process.env.HTTP_PROXY_HOST}:${process.env.HTTP_PROXY_PORT}`;

  const response = await got.get(`${process.env.MULTIENVEXPAPI_URL}message`, {
    agent: {
      https: new HttpsProxyAgent({
        proxy,
      }),
    },
  });

  const secretsManager = new SecretsManager();

  const secretValue = await secretsManager.getSecretValue({ SecretId: secretArn }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello from bff api two in ${stageName}! The message from the downstream experience api is "${
        JSON.parse(response.body).message
      }". Also, shhh, the value from the secret is "${secretValue.SecretString}"`,
    }),
  };
}
