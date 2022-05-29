const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');
const bcrypt = require('bcryptjs');

const userTable = 'tallertino-Xamarin-user';

async function update(userUpdateBody) {
  const identitycard = userUpdateBody.identitycard;
  const urlimg = userUpdateBody.urlimg;
  const fullname = userUpdateBody.fullname;
  const phone = userUpdateBody.phone;
  const email = userUpdateBody.email;
  const username = userUpdateBody.username;
  const password = userUpdateBody.password;
  const isfirstTime = userUpdateBody.isfirstTime;
  const token = userUpdateBody.token;
  if (
    !identitycard ||
    !urlimg ||
    !fullname ||
    !phone ||
    !email ||
    !username ||
    !isfirstTime ||
    !token
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, { message: verification });
  }

  const encryptedPw = bcrypt.hashSync(password.trim(), 10);

  userUpdateBody.password = encryptedPw;

  const saveUserResponse = await updateUser(userUpdateBody);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { update: 'Successfully updated' });
}

async function updateUser(userUpdateBody) {
  const params = {
    TableName: userTable,
    Key: {
      username: userUpdateBody.username,
    },
    UpdateExpression:
      'set identitycard = :i, urlimg = :s, fullname = :f, phone = :p, email= :e, password = :w, isfirstTime = :r',
    ExpressionAttributeValues: {
      ':i': userUpdateBody.identitycard,
      ':s': userUpdateBody.urlimg,
      ':f': userUpdateBody.fullname,
      ':p': userUpdateBody.phone,
      ':e': userUpdateBody.email,
      ':w': userUpdateBody.password,
      ':r': userUpdateBody.isfirstTime,
    },
  };

  return await dynamodb
    .update(params)
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

module.exports.update = update;
