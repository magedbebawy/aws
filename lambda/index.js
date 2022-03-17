const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamoTableName = 'product-inventory';

const healthPath = '/health';
const productPath = '/product';
const productsPath = '/products';

exports.handler = async (event) => {
    console.log('Request event', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200);
            break;
        case event.httpMethod === 'GET' && event.path === productPath:
            response = await getProduct(event.queryStringParameters.productId);
            break;
        case event.httpMethod === 'GET' && event.path === productsPath:
            response = await getProducts();
            break;
        case event.httpMethod === 'POST' && event.path === productPath:
            response = await saveProduct(JSON.parse(event.body));
            break;
        case event.httpMethod === 'PATCH' && event.path === productPath:
            const requestBody = JSON.parse(event.body);
            response = await updateProduct(requestBody.productId, requestBody.updateKey, requestBody.updateValue);
            break;
        case event.httpMethod === 'DELETE' && event.path === productPath:
            response = await deleteProduct(JSON.parse(event.body).productId);
            break;
    }
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
};

async function getProduct(productId) {
    const params = {
        TableName: dynamoTableName,
        keys: {
            'productId': productId,
        }
    };

    return await dynamodb.get(params).promise().then(response => {
        return buildResponse(200, response.item);
    }, (error) => {
        console.log(error);
    });
};

async function getProducts() {
    const params = {
        TableName: dynamoTableName
    }

    const allProducts = await scanDynamoRecords(params, []);
    const body = {
        products: allProducts
    }

    return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        if(dynamoData.LastEvaluateKey){
            itemArray = itemArray.concat(dynamoData.Items);
            scanParams.ExeclusiveStartKey = dynamoData.LastEvaluateKey;
            return scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;

    } catch (error) {
        console.log(error);
    }
}

async function saveProduct(requestBody) {
    const params = {
        TableName: dynamoTableName,
        Item: requestBody
    };

    return await dynamodb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        };

        return buildResponse(200, body);
    }, (error) => {
        console.log(error);
    });
}

async function updateProduct(productId, updateKey, updateValue) {
    const params = {
        TableName: dynamoTableName,
        Key: {
            'productId': productId,
        },
        updateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }

    return await dynamodb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            Item: response
        }

        return buildResponse(200, body);
    }, (error) => {
        console.log(error);
    });
}

async function deleteProduct(productId) {
    const params = {
        TableName: dynamoTableName,
        Key: {
            'productId': productId
        },
        ReturnValues: 'ALL_OLD'
    };

    return await dynamodb.delete(params).promise().then(response => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        };

        return buildResponse(200, body);
    }, (error) => {
        console.log(error)
    });
}