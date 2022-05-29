const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-contact';

async function post_Conctacs(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;
  const listContact = userInfo.ListContact;

  if (!userInfo || !username || !listContact) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  if (!Array.isArray(listContact)) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  /*
  const dynamodbContact = await getContact(billid);

  if (dynamodbContact && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'The contact already exist. Please choose a different identitycard',
    });
  }
  */
  const answer = [];
  for (var i = 0; i < listContact.length; i++) {
    const saveBilResponse = await Method_Post_Single(listContact[i]);
    if (!saveBilResponse) {
      return util.buildResponse(503, {
        message: 'Server Error. Pleas try againg later.',
      });
    }
    answer.push({
      message:
        'identitycar ' +
        listContact[i].identitycard +
        ' status ' +
        saveBilResponse,
    });
  }

  return util.buildResponse(200, { message: answer });
}
async function getContact(identitycard) {
  const params = {
    TableName: tableName,
    Key: {
      identitycard: identitycard,
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

module.exports.post_Conctacs = post_Conctacs;
