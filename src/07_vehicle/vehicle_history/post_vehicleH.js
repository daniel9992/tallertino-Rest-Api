const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../../utils/util');
const auth = require('../../../utils/auth');

const tableName = 'tallertino-Xamarin-vehiclehistory';

async function post_VehicleH(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const vehiclehistoryid = userInfo.vehiclehistoryid;
  const license_plate = userInfo.license_plate;
  const title = userInfo.title;
  const description = userInfo.description;
  const registrationDate = userInfo.registrationDate;

  if (
    !userInfo ||
    !username ||
    !vehiclehistoryid ||
    !license_plate ||
    !title ||
    !description ||
    !registrationDate
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const dynamodbVehicle = await getVehicleHistory(vehiclehistoryid);

  if (dynamodbVehicle && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'The contact already exist. Please choose a different identitycard',
    });
  }

  const vehicleHistory = {
    vehiclehistoryid: userInfo.vehiclehistoryid,
    license_plate: userInfo.license_plate,
    title: userInfo.title,
    description: userInfo.description,
    registrationDate: userInfo.registrationDate,
  };

  const saveBilResponse = await Method_Post_Single(vehicleHistory);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { calendar: calendar });
}
async function getVehicleHistory(vehiclehistoryid) {
  const params = {
    TableName: tableName,
    Key: {
      vehiclehistoryid: vehiclehistoryid,
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

// post
async function Method_Post_Single(vehicle) {
  const params = {
    TableName: tableName,
    Item: vehicle,
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

module.exports.post_VehicleH = post_VehicleH;
