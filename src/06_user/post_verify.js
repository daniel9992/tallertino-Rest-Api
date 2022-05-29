const util = require('../../utils/util');
const auth = require('../../utils/auth');

function verify(requestBody) {
  console.log(requestBody);

  if (!requestBody || !requestBody.username || !requestBody.token) {
    return util.buildResponse(401, {
      veryfy: false,
      message: 'Incorrect request body',
    });
  }

  const user = requestBody.username;
  const token = requestBody.token;

  const verification = auth.verifyToken(user, token);

  if (!verification.verified) {
    return util.buildResponse(401, { message: verification });
  }

  return util.buildResponse(200, {
    verified: true,
    message: 'success',
    user: user,
    token: token,
  });
}

module.exports.verify = verify;
