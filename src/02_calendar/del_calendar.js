const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-calendar';

async function del_calendar(userInfo) {
  const calendarid = userInfo.calendarid;
  const username = userInfo.username;
  const token = userInfo.token;

  if (!userInfo || !calendarid || !username || !token) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  var anwser = await Method_Delete(calendarid);

  const msm = '';
  if (anwser.stausCode === 200) {
    msm = 'Successfully deleted';
  } else {
    msm = anwser;
  }

  return util.buildResponse(anwser.stausCode, { message: msm });
}

// delete
async function Method_Delete(calendarid) {
  const params = {
    TableName: tableName,
    Key: {
      billid: billid,
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

module.exports.del_calendar = del_calendar;
