const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-vehicle';

async function post_Vehicle(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const vehicleid = userInfo.vehicleid;
  const license_plate = userInfo.license_plate;
  const brand = userInfo.brand;
  const model = userInfo.model;
  const year = userInfo.year;
  const fuel = userInfo.fuel;
  const color_ = userInfo.color_;
  const description = userInfo.description;
  const identitycard = userInfo.identitycard;

  if (
    !userInfo ||
    !username ||
    !vehicleid ||
    !license_plate ||
    !brand ||
    !model ||
    !year ||
    !fuel ||
    !color_ ||
    !description ||
    !identitycard
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const dynamodbVehicle = await getVehicle(vehicleid);

  if (dynamodbVehicle && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'The contact already exist. Please choose a different identitycard',
    });
  }

  const vehicle = {
    vehicleid: userInfo.vehicleid,
    license_plate: userInfo.license_plate,
    brand: userInfo.brand,
    model: userInfo.model,
    year: userInfo.year,
    fuel: userInfo.fuel,
    color_: userInfo.color_,
    description: userInfo.description,
    identitycard: userInfo.identitycard,
  };

  const saveBilResponse = await Method_Post_Single(vehicle);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { calendar: calendar });
}
async function getVehicle(vehicleid) {
  const params = {
    TableName: tableName,
    Key: {
      vehicleid: vehicleid,
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

module.exports.post_Vehicle = post_Vehicle;
