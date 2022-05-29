const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-publication';

async function get_Publication(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  if (!userInfo || !username || !token) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  return util.buildResponse(200, await Method_Get_All(tableName));
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

module.exports.get_Publication = get_Publication;
