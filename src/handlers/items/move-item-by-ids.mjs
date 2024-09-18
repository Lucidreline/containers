// get all item objexts from db
// if any return undefined, don't stop the whole process just say which were not moved
// get the sending and recieving container
// remove ids from the sending container
// add ids to the recieving container
// change item's container ids

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

if (process.env.AWS_SAM_LOCAL) {
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.19.0.2:8000"
    }));
}

const itemsTableName = process.env.ITEMS_TABLE_NAME;
const containersTableName = process.env.CONTAINERS_TABLE_NAME;

const getContainers = async (sendingContainerId, recievingContainerId) => {
    const sendingContainer = await getContainerById(sendingContainerId)
    const recievingContainer = await getContainerById(recievingContainerId)

    console.log("sendingContainer")

    if(sendingContainer == undefined || recievingContainer == undefined)
        return undefined

    
    return {
        sendingContainer,
        recievingContainer

    }
}

const getItemById = async (itemId) => {
    const params = {
        TableName: itemsTableName,
        Key: { id: itemId }
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
    console.log("is this even working?", itemList)
    itemList.forEach(async item => {
        console.log("item container id", item.container)
        item.container = recievingContainerId
        console.log("new id", item.container)


        const params = {
            TableName: itemsTableName,
            Item: item
        }

        try {
            await ddbDocClient.send(new PutCommand(params));
            console.log("Success - item added or updated");
        } catch (err) {
            console.log("Error while trying to change container Ids from items:", err.stack);
        }

    })

    return itemList
}

const getContainerById = async (containerId) => {
    var params = {
        TableName: containersTableName,
        Key: { id: containerId },
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        const container = data.Item;
        return container
    } catch (err) {
        console.log(`Error while looking for Container ${containerId}:`, err);
    }
}


const removeItemIds = async (itemIds, sendingContainer) => {
    itemIds.forEach(itemId => {
        const index = sendingContainer.items.indexOf(itemId)
        if (index > -1) {
            sendingContainer.items.splice(index, 1)
        }
    })

    const params = {
        TableName: containersTableName,
        Item: sendingContainer
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        console.log(`Success - items removed from container ${sendingContainer.id}`);
    } catch (err) {
        console.log("Error", err.stack);
    }
}

const addItemIds = async (itemIds, recievingContainer) => {
    console.log("recieving has", recievingContainer.items, "so adding", itemIds)
    const combo = recievingContainer.items.concat(itemIds)
    recievingContainer.items = combo
    console.log("result ", combo)

    const params = {
        TableName: containersTableName,
        Item: recievingContainer
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        console.log(`Success - Added items to container ${recievingContainer.id}`);
    } catch (err) {
        console.log("Error", err.stack);
    }
}








export const moveItemsByIdsHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`getMethod only accept POST method, you tried: ${event.httpMethod}`);
    }

    const body = JSON.parse(event.body);
    const itemIds = body.items; // payload will need an array called items
    const sendingContainerId = body.sendingContainer
    const recievingContainerId = body.recievingContainer

    const containers = await getContainers(sendingContainerId, recievingContainerId)
    if (containers == undefined)
        return {
            statusCode: 404,
            body: JSON.stringify({msg: "Something is wrong with the container Ids you gave me."})
        }

    const itemsList = getAllItemsByIdList(itemIds)

    changeItemContainerId(itemsList, containers.recievingContainer)

    removeItemIds(itemIds, containers.sendingContainer)

    addItemIds(itemIds, containers.recievingContainer)

      const response = {
        statusCode: 200,
        body: JSON.stringify(containers.recievingContainer)
      };

    return response;
}
