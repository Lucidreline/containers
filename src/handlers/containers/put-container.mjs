// Create clients and set shared const values outside of the handler.
// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

// redirect dynamodb if this is ran locally
if (process.env.AWS_SAM_LOCAL){
    ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
        endpoint: "http://172.19.0.2:8000"
      }));
}

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */

const isIdUnique = async(idInQuestion) => {
    var params = {
        TableName : tableName
    }

    let unique = true

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        let items = data.Items;

        items.forEach(container => {
            if(container.id === idInQuestion) unique = false
            
        });
    } catch (err) {
        console.log("Error while checking if ID is unique", err);
    }

    return unique
}

export const putContainerHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    // All log statements are written to CloudWatch
    //console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const id = body.id;
    const items = body.items
    const description = body.description

    if(await isIdUnique(id) == false){
        const nonUniqueMsg = `A container with the id ${id} already exists`
        console.log(nonUniqueMsg)
        return {
            statusCode: 409,
            body: JSON.stringify({msg: nonUniqueMsg})
        };
    }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: { id : id, items: items, description: description }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
      } catch (err) {
        console.log("Error", err.stack);
      }


    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    //console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
