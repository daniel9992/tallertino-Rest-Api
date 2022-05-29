const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'tallertino-Xamarin-user';

async function postLogin(user) {
  const username = user.username;
  const password = user.password;

  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: 'Username and Password are required',
    });
  }

  const dynamodbUser = await getUser(user.username.toLowerCase().trim());
  if (!dynamodbUser || !dynamodbUser.username) {
    return util.buildResponse(403, {
      message: 'User does not exist',
    });
  }

  if (!bcrypt.compareSync(password, dynamodbUser.password)) {
    return util.buildResponse(403, { message: 'Password is incorrect' });
  }

  const userInfo = {
    identitycard: dynamodbUser.identitycard,
    urlimg: dynamodbUser.urlimg,
    fullname: dynamodbUser.fullname,
    phone: dynamodbUser.phone,
    email: dynamodbUser.email,
    username: username.toLowerCase().trim(),
    password: dynamodbUser.encryptedPw,
    isfirstTime: dynamodbUser.isfirstTime,
  };

  const token = auth.generateToken(userInfo);

  const response = {
    user: userInfo,
    token: token,
  };

  return util.buildResponse(200, response);
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

module.exports.postLogin = postLogin;
