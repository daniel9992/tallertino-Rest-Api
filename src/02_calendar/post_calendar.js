const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-calendar';

async function post_Calendar(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const calendarid = userInfo.calendarid;
  const inicials = userInfo.inicials;
  const title = userInfo.title;
  const description = userInfo.description;
  const appointment = userInfo.appointment;
  const contact_identitycard = userInfo.contact_identitycard;
  const car_licenseplate = userInfo.car_licenseplate;
  const iscomplete = userInfo.iscomplete;
  const complete_description = userInfo.complete_description;
  const importance = userInfo.importance;

  if (
    !userInfo ||
    !username ||
    !token ||
    !calendarid ||
    !inicials ||
    !title ||
    !description ||
    !appointment ||
    !contact_identitycard ||
    !car_licenseplate ||
    !iscomplete ||
    !complete_description ||
    !importance
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const dynamodbCalendar = await getCalendar(billid);

  if (dynamodbCalendar && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'Bill already exists in our database. Please choose a different billid',
    });
  }

  const calendar = {
    calendarid: userInfo.calendarid,
    inicials: userInfo.inicials,
    title: userInfo.title,
    description: userInfo.description,
    appointment: userInfo.appointment,
    contact_identitycard: userInfo.contact_identitycard,
    car_licenseplate: userInfo.car_licenseplate,
    iscomplete: userInfo.iscomplete,
    complete_description: userInfo.complete_description,
    importance: userInfo.importance,
  };

  const saveBilResponse = await Method_Post_Single(calendar);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { calendar: calendar });
}
async function getCalendar(calendarid) {
  const params = {
    TableName: tableName,
    Key: {
      calendarid: calendarid,
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
async function Method_Post_Single(calendar) {
  const params = {
    TableName: tableName,
    Item: calendar,
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

module.exports.post_Calendar = post_Calendar;
