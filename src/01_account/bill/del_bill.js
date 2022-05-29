const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../../utils/util');
const bcrypt = require('bcryptjs');

const tableName = 'tallertino-Xamarin-account';

async function del_bill(userInfo) {
  const billid = userInfo.billid;
  const username = userInfo.username;
  const token = userInfo.token;

  if (!userInfo || !billid || !username || !token) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  var anwser = await Method_Delete(billid);

  const msm = '';
  if (anwser.stausCode === 200) {
    msm = 'Successfully deleted';
  } else {
    msm = anwser;
  }

  return util.buildResponse(anwser.stausCode, { message: msm });
}

// delete
async function Method_Delete(billid) {
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

module.exports.del_bill = del_bill;
