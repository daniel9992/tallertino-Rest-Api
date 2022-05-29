//  tallertino-Xamarin-workshop
const auth = require('../../utils/auth');
const utils = require('../../utils/util');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const workshopTable = 'tallertino-Xamarin-workshop';

async function post_Workshop(wSPBody) {
  if (
    !wSPBody ||
    !wSPBody.username ||
    !wSPBody.token ||
    !wSPBody.workshopid ||
    !wSPBody.name ||
    !wSPBody.description ||
    !wSPBody.phone ||
    !wSPBody.phone2 ||
    !wSPBody.mission ||
    !wSPBody.vision ||
    !wSPBody.imglist
  ) {
    return utils.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const username = wSPBody.username;
  const token = wSPBody.token;

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return utils.buildResponse(401, { message: verification });
  }

  const saveUserResponse = await updateWorkshop(wSPBody);
  if (!saveUserResponse) {
    return utils.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return utils.buildResponse(200, { update: 'Successfully updated' });
}

async function updateWorkshop(workshopid) {
  const params = {
    TableName: workshopTable,
    Key: {
      workshopid: workshopid.workshopid,
    },
    UpdateExpression:
      'set name = :n, description = :d, phone = :p, phone2 = :h, mission= :m, vision = :v, imglist = :i',
    ExpressionAttributeValues: {
      ':n': workshopid.name,
      ':d': workshopid.description,
      ':p': workshopid.phone,
      ':h': workshopid.phone2,
      ':m': workshopid.mission,
      ':v': workshopid.vision,
      ':i': workshopid.imglist,
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

module.exports.post_Workshop = post_Workshop;
