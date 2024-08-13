export const pingHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`ping only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const response = {
        statusCode: 200,
        body: JSON.stringify({msg: "Hi, you've reached the container server"})
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
