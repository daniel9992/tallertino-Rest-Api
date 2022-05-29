//  tallertino-Xamarin-workshop
const auth = require('../../utils/auth');
const utils = require('../../utils/util');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const workshopTable = 'tallertino-Xamarin-workshop';

async function get_Workshop(wSGBody) {
  if (!wSGBody || !wSGBody.username || !wSGBody.token || !wSGBody.key) {
    return utils.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const username = wSGBody.username;
  const token = wSGBody.token;
  const key = wSGBody.key;
  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return utils.buildResponse(401, verification);
  }

  return utils.buildResponse(200, await getWorkShop(key));
}

async function getWorkShop(key) {
  const params = {
    TableName: workshopTable,
    Key: {
      workshopid: key,
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

module.exports.get_Workshop = get_Workshop;
