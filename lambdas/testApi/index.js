const mysql = require('mysql');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');

const connection = mysql.createConnection({
    user: "admin",
    host: "hautewellness.cdgkwvnyt6i5.us-west-1.rds.amazonaws.com",
    port: 3306,
    password: "akhmaLpbkbYRQHXVjhcRfbuA",
    database: "sys"
});

exports.handler = async (body) => {

 // const body = event; //await JSON.parse(event.body);
  if (!body) return {statusCode: 401, body: body };
	if (!body.id_token) return {statusCode: 401, body: JSON.stringify("ERROR: no body id_token")};

	const jwtOutput = await getAppleUserId(body.id_token);
	if (jwtOutput != 'SUCCESS') return {statusCode: 401, body: JSON.stringify('ERROR: invalid id_token')};

	const apiParams = [];
	apiParams.push(body.monday);
	apiParams.push(body.tuesday);
	apiParams.push(body.wednesday);
	apiParams.push(body.thursday);
	apiParams.push(body.friday);
	apiParams.push(body.saturday);
	apiParams.push(body.sunday);

  const apiQuery = `
    SELECT ws.workoutid, ws.schedule_date, w.name, w.filename, w.json_content
    FROM WORKOUTS w, (
    SELECT * FROM WORKOUTS_SCHEDULE WHERE
      schedule_date = ?
      OR schedule_date = ?
      OR schedule_date = ?
      OR schedule_date = ?
      OR schedule_date = ?
      OR schedule_date = ?
      OR schedule_date = ?
      ORDER BY schedule_date ASC
      ) ws
    WHERE ws.workoutid = w.workoutid
    ORDER BY ws.schedule_date ASC`;

   try {
       const data = await new Promise((resolve, reject) => {

          connection.query(apiQuery, apiParams, function (err, result) {
             if (err) {
                 console.log('ERROR: ', err);
                 reject(err);
             }
             resolve(result);
         });
       });

       return {
           statusCode: 200,
           body: data
       }
   } catch (err) {
       return {
           statusCode: 400,
           body: err.message
       }
   }
};

const getAppleUserId = async (token) => {

  const keys = await _getApplePublicKeys();
  const decodedToken = jwt.decode(token, { complete: true });
	if (!decodedToken) return "ERROR";

  const kid = decodedToken.header.kid;
  const key = keys.find(k => k.kid === kid);

  const pubKey = new NodeRSA();
  pubKey.importKey(
    { n: Buffer.from(key.n, 'base64'), e: Buffer.from(key.e, 'base64') },
    'components-public'
  );
  const userKey = pubKey.exportKey(['public']);
  const jwtOutput = jwt.verify(token, userKey, {
	    algorithms: 'RS256',
	  }, (err, authData) => {
	    if(err) {
				return "ERROR";
	    } else {
				return "SUCCESS";
    }
  });

	return jwtOutput;
};

async function _getApplePublicKeys() {

  return axios
    .request({
      method: 'GET',
      url: 'https://appleid.apple.com/auth/keys',
    })
    .then(response => response.data.keys);
}
