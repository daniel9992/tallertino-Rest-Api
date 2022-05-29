const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../../utils/util');
const auth = require('../../../utils/auth');

const tableName = 'tallertino-Xamarin-vehiclehistory';

async function del_VehicleHistory(userInfo) {
  const vehiclehistoryid = userInfo.vehiclehistoryid;
  const username = userInfo.username;
  const token = userInfo.token;

  if (!userInfo || !vehiclehistoryid || !username || !token) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  var anwser = await Method_Delete(vehiclehistoryid);

  const msm = '';
  if (anwser.stausCode === 200) {
    msm = 'Successfully deleted';
  } else {
    msm = anwser;
  }

  return util.buildResponse(anwser.stausCode, { message: msm });
}

// delete
async function Method_Delete(vehiclehistoryid) {
  const params = {
    TableName: tableName,
    Key: {
      vehiclehistoryid: vehiclehistoryid,
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

module.exports.del_VehicleHistory = del_VehicleHistory;
