const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

const util = require('../../../utils/util');

const tableName = 'tallertino-Xamarin-account';

async function post_bill(userInfo) {
  const username = userInfo.username;
  const token = userInfo.token;

  const billid = userInfo.billid;
  const date_time = userInfo.date_time;
  const numberofweek = userInfo.numberofweek;

  const contact_identitycard = userInfo.contact_identitycard;
  const contact_name = userInfo.contact_name;
  const car_licenseplate = userInfo.car_licenseplate;

  const user_identitycard = userInfo.user_identitycard;

  const itemlist = userInfo.itemlist;
  const type = userInfo.type;
  const bruto = userInfo.bruto;
  const off = userInfo.off;
  const subtotal = userInfo.subtotal;
  const iva = userInfo.iva;
  const total = userInfo.total;

  if (
    !userInfo ||
    !username ||
    !token ||
    !billid ||
    !date_time ||
    !numberofweek ||
    !contact_identitycard ||
    !contact_name ||
    !car_licenseplate ||
    !user_identitycard ||
    !itemlist ||
    !type ||
    !bruto ||
    !off ||
    !subtotal ||
    !iva ||
    !total
  ) {
    return util.buildResponse(401, {
      message: 'All fields are required',
    });
  }

  const verification = auth.verifyToken(username, token);

  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  const dynamodbBill = await getBill(billid);

  if (dynamodbBill && dynamodbBill.billid) {
    return util.buildResponse(401, {
      message:
        'Bill already exists in our database. Please choose a different billid',
    });
  }

  const bill = {
    billid: userInfo.billid,
    date_time: userInfo.date_time,
    numberofweek: userInfo.numberofweek,

    contact_identitycard: userInfo.contact_identitycard,
    contact_name: userInfo.contact_name,
    car_licenseplate: userInfo.car_licenseplate,

    user_identitycard: userInfo.user_identitycard,

    itemlist: userInfo.itemlist,
    type: userInfo.type,
    bruto: userInfo.bruto,
    off: userInfo.off,
    subtotal: userInfo.subtotal,
    iva: userInfo.iva,
    total: userInfo.total,
  };

  const saveBilResponse = await Method_Post_Single(bill);
  if (!saveBilResponse) {
    return util.buildResponse(503, {
      message: 'Server Error. Pleas try againg later.',
    });
  }

  return util.buildResponse(200, { billid: bill });
}
async function getBill(billid) {
  const params = {
    TableName: tableName,
    Key: {
      billid: billid,
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
async function Method_Post_Single(itemObj) {
  const params = {
    TableName: tableName,
    Item: itemObj,
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

module.exports.post_bill = post_bill;
