// get all item objexts from db
// if any return undefined, don't stop the whole process just say which were not moved
// get the sending and recieving container
// remove ids from the sending container
// add ids to the recieving container
// change item's container ids

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

if (process.env.AWS_SAM_LOCAL){
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.19.0.2:8000"
      }));
}

const itemsTableName = process.env.ITEMS_TABLE_NAME;
const containersTableName = process.env.CONTAINERS_TABLE_NAME;

const getContainers = (sendingContainerId, recievingContainerId) => {

}

const getItemById = async (itemId) => {
    const params = {
        TableName: itemsTableName,
        Key: {id: itemId}
    }

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        const item = data.Item;
        return item

      } catch (err) {
        console.log("Error when trying to get an item by id:", err);
        return undefined
      }

}

const getAllItemsByIdList = (itemIdList) => {
    let itemList = []

    itemIdList.forEach(async itemId => {
        itemList.push(await getItemById(itemId))
    })

    return itemList

}

const changeItemContainerId = async (itemList, recievingContainerId) => {
    itemList.forEach(async item => {
        item.container = recievingContainerId

        const params = {
            TableName: containersTableName,
            Item: item
        }

        try {
            await ddbDocClient.send(new PutCommand(params));
            console.log("Success - item added or updated", data);
        } catch (err) {
            console.log("Error", err.stack);
        }

    })
}

const getSendingContainer = async (sendingContainerId) => {

}

const getRecievingContainer = async (recievingContainerId) => {

}

const removeItemIds = async (sendingContainerId) => {

}

const addItemIds = async (recievingContainerId) => {

}








export const moveItemsByIdsHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
    throw new Error(`getMethod only accept POST method, you tried: ${event.httpMethod}`);
  }
 
  const body = JSON.parse(event.body);
  const itemIds = body.items; // payload will need an array called items
  const sendingContainerId = body.sendingContainer
  const recievingContainerId = body.recievingContainer

 
//   var params = {
//     TableName : tableName,
//     Key: { id: id },
//   };

//   try {
//     const data = await ddbDocClient.send(new GetCommand(params));
//     var item = data.Item;
//   } catch (err) {
//     console.log("Error", err);
//   }
 
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify(item)
//   };
 
  return response;
}
