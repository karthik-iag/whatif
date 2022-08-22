import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));

  const stageName = process.env.STAGE_NAME;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello from experience api in ${stageName}!`,
    }),
  };
}
