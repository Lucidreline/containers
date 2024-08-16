import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

// redirect dynamodb if this is ran locally
if (process.env.AWS_SAM_LOCAL) {
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.19.0.2:8000"
    }));
}

// Get the DynamoDB table name from environment variables
const itemsTableName = process.env.ITEMS_TABLE_NAME;
const containersTableName = process.env.CONTAINERS_TABLE_NAME;

const getContainerInQuestion = async (id) => {
    var params = {
        TableName : containersTableName,
        Key: { id: id },
      };

      let container

      try {
        const data = await ddbDocClient.send(new GetCommand(params));
        container = data.Item;
      } catch (err) {
        console.log("Error", err);
      }

    return container
}

const deleteItemsInContainer = (itemIds => {
    try {
        itemIds.forEach(async itemId => {
            await ddbDocClient.send(new DeleteCommand({
                TableName: itemsTableName,
                Key: { id: itemId }
            }));
        })
    } catch (error) {
        console.log("Error while deleting container items", err.stack);
    }
})

const deleteContainer = async (containerId) => {
   
    try {
        await ddbDocClient.send(new DeleteCommand({
            TableName: containersTableName,
            Key: { id: containerId }
        }));
    } catch (err) {
        console.log("Error while grabbing all IDs for deletion", err);
    }
}

export const deleteContainerByIdHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`postMethod only accepts DELETE method, you tried: ${event.httpMethod} method.`);
    }

    const id = event.pathParameters.id;

    const container = await getContainerInQuestion(id)

    if(container == undefined){
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: `Container ${id} does not exist.` })
        }
    }

    deleteItemsInContainer(container.items)

    deleteContainer(container.id)

    const response = {
        statusCode: 200,
        body: JSON.stringify({ msg: "☠ CONTAINER DELETED | ITEMS IN CONTAINER PURGED ☠" })
    };

    // All log statements are written to CloudWatch
    //console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};