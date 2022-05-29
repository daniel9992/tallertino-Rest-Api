const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const bcrypt = require('bcryptjs');

const userTable = 'tallertino-Xamarin-user';

async function register(userInfo) {
  const identitycard = userInfo.identitycard;
  const urlimg = userInfo.urlimg;
  const fullname = userInfo.fullname;
  const phone = userInfo.phone;
  const email = userInfo.email;
  const username = userInfo.username;
  const password = userInfo.password;
  const isfirstTime = userInfo.isfirstTime;
  if (
    !identitycard ||
    !urlimg ||
    !fullname ||
    !phone ||
    !email ||
    !username ||
    !password ||
    !isfirstTime
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const dynamodbUser = await getUser(username.toLowerCase().trim());

  if (dynamodbUser && dynamodbUser.username) {
    return util.buildResponse(401, {
      message:
        'Username already exists in our database. Please choose a different username',
    });
  }

  const encryptedPw = bcrypt.hashSync(password.trim(), 10);

  const user = {
    identitycard: identitycard,
    urlimg: urlimg,
    fullname: fullname,
    phone: phone,
    email: email,
    username: username.toLowerCase().trim(),
    password: encryptedPw,
    isfirstTime: isfirstTime,
  };

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { username: username });
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
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

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user,
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

module.exports.register = register;
