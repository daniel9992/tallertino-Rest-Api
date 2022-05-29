const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-contact';

async function post_Conctac(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const identitycard = userInfo.Contact_.identitycard;
  const name = userInfo.Contact_.Name;
  const phone = userInfo.Contact_.Phone;
  const email = userInfo.Contact_.Email;
  const description = userInfo.Contact_.Description;
  const typeContact = userInfo.Contact_.Type;
  const inicials = userInfo.Contact_.Inicials;
  const hascar = userInfo.Contact_.Hascar;
  const urlimg = userInfo.Contact_.Urlimg;

  if (
    !userInfo ||
    !username ||
    !identitycard ||
    !name ||
    !phone ||
    !email ||
    !description ||
    !typeContact ||
    !inicials ||
    !hascar ||
    !urlimg
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const dynamodbContact = await getContact(identitycard);

  if (dynamodbContact && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'The contact already exist. Please choose a different identitycard',
    });
  }

  const contact = {
    identitycard: identitycard,
    Name: name,
    Phone: phone,
    Email: email,
    Description: description,
    TypeContact: typeContact,
    Inicials: inicials,
    Hascar: hascar,
    Urlimg: urlimg,
  };

  const saveBilResponse = await Method_Post_Single(contact);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { message: saveBilResponse });
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

module.exports.post_Conctac = post_Conctac;
