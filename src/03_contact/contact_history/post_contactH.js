const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../../utils/util');
const auth = require('../../../utils/auth');

const tableName = 'tallertino-Xamarin-contactHistory';

async function post_ConctacH(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const historyID = userInfo.historyID;
  const identitycard = userInfo.identitycard;
  const activity = userInfo.activity;
  const description = userInfo.description;
  const registrationDate = userInfo.registrationDate;

  if (
    !userInfo ||
    !username ||
    !token ||
    !historyID ||
    !identitycard ||
    !activity ||
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

  const dynamodbContact = await getContactH(historyID);

  if (dynamodbContact && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'The contact history already exist. Please choose a different historyID',
    });
  }

  const contactH = {
    historyID: userInfo.historyID,
    identitycard: userInfo.identitycard,
    activity: userInfo.activity,
    description: userInfo.description,
    registrationDate: userInfo.registrationDate,
  };

  const saveBilResponse = await Method_Post_Single(contactH);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { calendar: calendar });
}
async function getContactH(historyID) {
  const params = {
    TableName: tableName,
    Key: {
      historyID: historyID,
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

module.exports.post_ConctacH = post_ConctacH;
