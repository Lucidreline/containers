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

const getContainerById = async (id) => {
    const params = {
        TableName: containersTableName,
        Key: { id: id },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        var item = data.Item;
    } 
    catch (err){
        console.log(`Error when looking for container ${id}:`, err);
    } 
    
    return item
}

const updateContainerItemsList = async (container, itemId) => {
    container.items.push(itemId)

    var params = {
        TableName: containersTableName,
        Item: container
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
    } catch (err) {
        console.log("Error", err.stack);
    }

    console.log(`Updated container ${container.id}`, container)
}

export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }


    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = uuidv4();
    const containerId = body.container

    const containerToLink = await getContainerById(containerId)

    // stops the item from being added if the container does not exist
    if (containerToLink == undefined) {
        return {
            statusCode: 404,
            body: JSON.stringify({msg: `Stopping item creation, can't find container ${containerId}`})
        }
    }

    updateContainerItemsList(containerToLink, id)

    var params = {
        TableName: itemsTableName,
        Item: {id, container: containerId, ...body }
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

    return response;
};
