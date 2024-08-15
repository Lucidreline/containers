// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
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

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */

const getContainerById = async (id) => {
    const params = {
        TableName: containersTableName,
        Key: { id: id },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        var item = data.Item;
    } catch (err) {
        console.log(`Error when looking for container ${id}:`, err);
    }

    return item
}

const updateContainerById = async (containerId, itemId) => {

}

export const putItemHandler = async (event) => {


    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    //console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = uuidv4();
    const name = body.name;
    const description = body.description
    const containerId = body.container
    const quantity = body.quantity

    const containerToLink = await getContainerById(containerId)

    if (containerToLink == undefined) {
        return {
            statusCode: 404,
            body: JSON.stringify({msg: `Stopping item creation, can't find container ${containerId}`})
        }
    }

    console.log("container",) // returns undefined if no container exists with that id

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName: itemsTableName,
        Item: { id: id, name: name, description: description, container: containerId, quantity: quantity }
    };

    let data;

    try {
        data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
    } catch (err) {
        console.log("Error", err.stack);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
