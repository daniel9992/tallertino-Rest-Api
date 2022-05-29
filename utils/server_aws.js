const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

// get
async function Method_Get_byId({ id, tableName }) {
  const params = {
    TableName: tableName,
    Key: {
      identitycard: id,
    },
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      response => {
        return response.Item;
      },
      error => {
        console.error('There is an error getting user: ', error);
      }
    );
}
async function Method_Get_All(tableName) {
  const params = {
    TableName: tableName,
  };

  const scanResults = [];

  let items;

  do {
    items = await dynamodb.scan(params).promise();

    items.Items.forEach(item => scanResults.push(item));

    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');

  return scanResults;
}

// post
async function Method_Post_Single(itemObj) {
  console.log('Method_Post_Single', itemObj);
  const params = {
    TableName: itemObj.tableName,
    Item: itemObj.obj,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      error => {
        console.error('There is an error saving user: ', error);
      }
    );
}

// delete
async function Method_Delete({ id, tableName }) {
  const params = {
    TableName: tableName,
    Key: {
      identitycard: id,
    },
  };
  return await dynamodb
    .delete(params)
    .promise()
    .then(
      response => {
        return response.Item;
      },
      error => {
        return error;
      }
    );
}

module.exports.Method_Get_byId = Method_Get_byId;
module.exports.Method_Get_All = Method_Get_All;
module.exports.Method_Post_Single = Method_Post_Single;
module.exports.Method_Delete = Method_Delete;
