import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));

  const stageName = process.env.STAGE_NAME;

  const docClient = new DynamoDB.DocumentClient({ region: 'ap-southeast-2' });

  const tableName = process.env.DDB_TABLE_MULTIENV;

  if (!tableName) {
    throw new Error('Unable to find environment variable named DDB_TABLE_MULTIENV');
  }

  const existingTableName = process.env.DDB_TABLE_EXISTINGMULTIENVTABLE;

  if (!existingTableName) {
    throw new Error('Unable to find environment variable named DDB_TABLE_EXISTINGMULTIENVTABLE');
  }

  const tableParams = {
    TableName: tableName,
    Key: {
      id: '1',
    },
  };

  const tableData = await docClient.get(tableParams).promise();

  const existingTableParams = {
    TableName: existingTableName,
    Key: {
      id: '1',
    },
  };

  const existingTableData = await docClient.get(existingTableParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello from bff api one in ${stageName}! Data from the table named ${tableName} is "${tableData.Item?.message}" and data from the table named ${existingTableName} is "${existingTableData.Item?.message}"`,
    }),
  };
}
