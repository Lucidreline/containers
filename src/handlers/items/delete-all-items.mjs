import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

// redirect dynamodb if this is ran locally
if (process.env.AWS_SAM_LOCAL) {
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.19.0.2:8000"
    }));
}

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

const getAllIds = async () => {
    var params = {
        TableName: tableName
    }

    let IDs = []

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        let items = data.Items;

        items.forEach(container => {
            IDs.push(container.id)
        });
    } catch (err) {
        console.log("Error while grabbing all IDs for deletion", err);
    }

    return IDs
}

export const deleteAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`postMethod only accepts DELETE method, you tried: ${event.httpMethod} method.`);
    }

    // const body = JSON.parse(event.body);




    try {
        const idList = await getAllIds()
        idList.forEach(async id => {
            await ddbDocClient.send(new DeleteCommand({
                TableName: tableName,
                Key: { id: id }
            }));
            console.log("Successfully deleted container", id);
        })
        
    } catch (err) {
        console.log("Error", err.stack);
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify({ msg: "☠ Items PURGED ☠" })
    };

    // All log statements are written to CloudWatch
    //console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};