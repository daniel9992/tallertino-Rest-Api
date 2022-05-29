const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../../utils/util');
const auth = require('../../../utils/auth');

const tableName = 'tallertino-Xamarin-contactHistory';

async function del_ContactH(userInfo) {
  const historyID = userInfo.historyID;
  const username = userInfo.username;
  const token = userInfo.token;

  if (!userInfo || !historyID || !username || !token) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  var anwser = await Method_Delete(historyID);

  const msm = '';
  if (anwser.stausCode === 200) {
    msm = 'Successfully deleted';
  } else {
    msm = anwser;
  }

  return util.buildResponse(anwser.stausCode, { message: msm });
}

// delete
async function Method_Delete(historyID) {
  const params = {
    TableName: tableName,
    Key: {
      historyID: historyID,
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

module.exports.del_ContactH = del_ContactH;
