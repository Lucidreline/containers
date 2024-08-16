import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

if (process.env.AWS_SAM_LOCAL){
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.19.0.2:8000"
      }));
}

const itemsTableName = process.env.ITEMS_TABLE_NAME;
const containersTableName = process.env.CONTAINERS_TABLE_NAME;

const getItem = async itemId => {
    var params = {
        TableName : itemsTableName,
        Key: { id: itemId },
      };

      let item

      try {
        const data = await ddbDocClient.send(new GetCommand(params));
        item = data.Item;
      } catch (err) {
        console.log("Error", err);
      }

    return item
}

const getContainer = async containerId => {
    var params = {
        TableName : containersTableName,
        Key: { id: containerId },
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

const removeIdFromContainer = async (container, itemId) => {
    const index = container.items.indexOf(itemId)
    if (index > -1){
        container.items.splice(index, 1)
    }

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
}

const deleteItem = async itemId => {
    try {
        await ddbDocClient.send(new DeleteCommand({
            TableName: itemsTableName,
            Key: { id: itemId }
        }));
    } catch (error) {
        console.log(`Error while deleting item ${itemId}`, error)
    }
    
}

export const deleteItemByIdHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`getAllItems only accept DELETE method, you tried: ${event.httpMethod}`);
    }

    const itemId = event.pathParameters.id;

    const item = await getItem(itemId)

    if(item == undefined){
        return {
            statusCode: 200,
            body: JSON.stringify({msg: `Item ${itemId} can't be found`})
        }
    }

    const container = await getContainer(item.container)

    await removeIdFromContainer(container, itemId)
    await deleteItem(itemId)
    


    
    const response = {
        statusCode: 200,
        body: JSON.stringify({msg: "Item Deleted"})
    };

    return response;
}
