const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-contact';

async function get_Contact(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;
  const typeContact = userInfo.TypeContact;

  if (!userInfo || !username || !token || !typeContact) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  if (typeContact === 'todo') {
    return util.buildResponse(200, await Method_Get_All());
  } else {
    return util.buildResponse(200, await Method_Get_Type(typeContact));
  }
}

async function Method_Get_Type(typeContact) {
  const params = {
    TableName: tableName,
    FilterExpression: 'TypeContact = :t',
    ExpressionAttributeValues: { ':t': typeContact },
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

async function Method_Get_All() {
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

module.exports.get_Contact = get_Contact;
