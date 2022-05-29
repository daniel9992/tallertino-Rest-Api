const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../utils/util');
const auth = require('../../utils/auth');

const tableName = 'tallertino-Xamarin-publication';

async function post_Publication(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const publicationid = userInfo.publicationid;
  const type_obje = userInfo.type_obje;
  const get_publication = userInfo.get_publication;
  const get_promotion = userInfo.get_promotion;
  const get_offert = userInfo.get_offert;

  if (
    !userInfo ||
    !username ||
    !token ||
    !publicationid ||
    !type_obje ||
    !get_publication ||
    !get_promotion ||
    !get_offert
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const dynamodbPublication = await getPublication(publicationid);

  if (dynamodbPublication && getCalendar.calendarid) {
    return util.buildResponse(401, {
      message:
        'The contact history already exist. Please choose a different historyID',
    });
  }

  const publication = {
    publicationid: userInfo.publicationid,
    type_obje: userInfo.type_obje,
    get_publication: userInfo.get_publication,
    get_promotion: userInfo.get_promotion,
    get_offert: userInfo.get_offert,
  };

  const saveBilResponse = await Method_Post_Single(publication);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { calendar: calendar });
}
async function getPublication(publicationid) {
  const params = {
    TableName: tableName,
    Key: {
      publicationid: publicationid,
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
async function Method_Post_Single(publication) {
  const params = {
    TableName: tableName,
    Item: publication,
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

module.exports.post_Publication = post_Publication;
