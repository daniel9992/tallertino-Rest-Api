//-----------------------------------------------------------------
const utils = require('./utils/util');

// ----------------------------------------------------------------
// 01 account
// ----------------------------------------------------------------
const bill_Path = '/account/bill';

const del_bill = require('./src/01_account/bill/del_bill');
const get_bill = require('./src/01_account/bill/get_bill');
const post_bill = require('./src/01_account/bill/post_bill');

// ----------------------------------------------------------------
// 02 calendar
// ----------------------------------------------------------------
const calendar_Path = '/calendar';

const del_calendar = require('./src/02_calendar/del_calendar');
const get_calendar = require('./src/02_calendar/get_calendar');
const post_calendar = require('./src/02_calendar/post_calendar');

// ----------------------------------------------------------------
// 03 contact
// ----------------------------------------------------------------
const contact_Path = '/contact';

const del_contact = require('./src/03_contact/del_contact');
const get_contact = require('./src/03_contact/get_contact');
const post_contact = require('./src/03_contact/post_contact');

const contacts_Path = '/contact/contacts';
const post_contacts = require('./src/03_contact/post_contacts');

// contact history
const contact_HistoryPath = '/contact/contacthistory';

const del_contactH = require('./src/03_contact/contact_history/del_contactH');
const get_contactH = require('./src/03_contact/contact_history/get_contactH');
const post_contactH = require('./src/03_contact/contact_history/post_contactH');

// ----------------------------------------------------------------
// 04 health
// ----------------------------------------------------------------
const healthPath = '/health';

// ----------------------------------------------------------------
// 05 publication
// ----------------------------------------------------------------
const publication_Path = '/publication';

const del_publication = require('./src/05_publication/del_publication');
const get_publication = require('./src/05_publication/get_publication');
const post_publication = require('./src/05_publication/post_publication');

// ----------------------------------------------------------------
// 06 user
// ----------------------------------------------------------------
const userLoginPath = '/user/login';
const userRegisterPath = '/user/register';
const userVerifyPath = '/user/verify';
const userUpdatePath = '/user/update';

const post_login = require('./src/06_user/post_login');
const post_register = require('./src/06_user/post_register');
const post_verify = require('./src/06_user/post_verify');
const post_update = require('./src/06_user/post_update');

// ----------------------------------------------------------------
// 07 vehicle
// ----------------------------------------------------------------
const vehicle_Path = '/vehicle';

const del_vehicle = require('./src/07_vehicle/del_vehicle');
const get_vehicle = require('./src/07_vehicle/get_vehicle');
const post_vehicle = require('./src/07_vehicle/post_vehicle');

// vehicle History
const vehicle_History_Path = '/vehicle/vehicle_history';

const del_vehicleH = require('./src/07_vehicle/vehicle_history/del_vehicleH');
const get_vehicleH = require('./src/07_vehicle/vehicle_history/get_vehicleH');
const post_vehicleH = require('./src/07_vehicle/vehicle_history/post_vehicleH');

// ----------------------------------------------------------------
// 08 workshop
// ----------------------------------------------------------------
const workShop_Path = '/workshop';

const get_workshop = require('./src/08_workshop/get_workshop');
const post_workshop = require('./src/08_workshop/post_workshop');

exports.handler = async event => {
  console.log('Request Event: ', event);

  let response;
  const mainbody = JSON.parse(event.body);

  switch (true) {
    // ----------------------------------------------------------------
    // 01 account
    // ----------------------------------------------------------------
    case event.httpMethod === 'DELETE' && event.path === bill_Path:
      // code
      response = del_bill.del_bill(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === bill_Path:
      // code
      response = get_bill.get_bill(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === bill_Path:
      // code
      response = post_bill.post_bill(mainbody);
      break;
    // ----------------------------------------------------------------
    // 02 calendar
    // ----------------------------------------------------------------
    case event.httpMethod === 'DELETE' && event.path === calendar_Path:
      // code
      response = del_calendar.del_calendar(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === calendar_Path:
      // code
      response = get_calendar.get_Calendar(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === calendar_Path:
      // code
      response = post_calendar.post_Calendar(mainbody);
      break;
    // ----------------------------------------------------------------
    // 03 contact
    // ----------------------------------------------------------------
    case event.httpMethod === 'DELETE' && event.path === contact_Path:
      // code
      response = del_contact.del_Contact(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === contact_Path:
      // code
      response = get_contact.get_Contact(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === contact_Path:
      // code
      response = post_contact.post_Conctac(mainbody);
      break;
    case event.httpMethod === 'POST' && event.path === contacts_Path:
      // code
      response = post_contacts.post_Conctacs(mainbody);
      break;
    //-------------------Contact History---------------------------------
    case event.httpMethod === 'DELETE' && event.path === contact_HistoryPath:
      // code
      response = del_contactH.del_ContactH(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === contact_HistoryPath:
      // code
      response = get_contactH.get_ContactH(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === contact_HistoryPath:
      // code
      response = post_contactH.post_ConctacH(mainbody);
      break;

    // ----------------------------------------------------------------
    // 04 health
    // ----------------------------------------------------------------
    case event.httpMethod === 'GET' && event.path === healthPath:
      // code
      response = utils.buildResponse(200, 'Success !!! healthPath');
      break;
    case event.httpMethod === 'OPTIONS':
      response = utils.buildCORSResponse(200, 'Success');
      break;
    // ----------------------------------------------------------------
    // 05 publication
    // ----------------------------------------------------------------
    case event.httpMethod === 'DELETE' && event.path === publication_Path:
      // code
      response = del_publication.del_Publication(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === publication_Path:
      // code
      response = get_publication.get_Publication(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === publication_Path:
      // code
      response = post_publication.post_Publication(mainbody);
      break;
    // ----------------------------------------------------------------
    // 06 user
    // ----------------------------------------------------------------
    case event.httpMethod === 'POST' && event.path === userLoginPath:
      // code
      const userPostBody = JSON.parse(event.body);
      response = await post_login.postLogin(userPostBody);
      break;

    case event.httpMethod === 'POST' && event.path === userRegisterPath:
      // code
      const registerPostBody = JSON.parse(event.body);
      response = await post_register.register(registerPostBody);
      break;

    case event.httpMethod === 'POST' && event.path === userVerifyPath:
      // code
      const userverifyPostBody = JSON.parse(event.body);
      response = post_verify.verify(userverifyPostBody);
      break;
    case event.httpMethod === 'POST' && event.path === userUpdatePath:
      const userUpdateBody = JSON.parse(event.body);
      response = await post_update.update(userUpdateBody);
      break;

    // ----------------------------------------------------------------
    // 07 vehicle
    // ----------------------------------------------------------------
    case event.httpMethod === 'DELETE' && event.path === vehicle_Path:
      // code
      response = del_vehicle.del_Vehicle(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === vehicle_Path:
      // code
      response = get_vehicle.get_Vehicle(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === vehicle_Path:
      // code
      response = post_vehicle.post_Vehicle(mainbody);
      break;

    //-------------------History--------------------------------------
    case event.httpMethod === 'DELETE' && event.path === vehicle_History_Path:
      // code
      response = del_vehicleH.del_VehicleHistory(mainbody);
      break;
    case event.httpMethod === 'GET' && event.path === vehicle_History_Path:
      // code
      response = get_vehicleH.get_VehicleH(mainbody);
      break;

    case event.httpMethod === 'POST' && event.path === vehicle_History_Path:
      // code
      response = post_vehicleH.post_VehicleH(mainbody);
      break;

    // ----------------------------------------------------------------
    // 08 workshop
    // ----------------------------------------------------------------

    case event.httpMethod == 'GET' && event.path === workShop_Path:
      // code
      response = get_workshop.get_Workshop(mainbody);
      break;
    case event.httpMethod == 'POST' && event.path === workShop_Path:
      // code
      response = post_workshop.post_Workshop(mainbody);
      break;

    // ----------------------------------------------------------------
    // default
    // ----------------------------------------------------------------

    default:
      // code
      response = utils.buildResponse(404, '404 Not Found perra :) :p ');
  }
  return response;
};

//
