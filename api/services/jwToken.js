/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

let fs = require('fs');
let jwt = require('jsonwebtoken');

const privateFilePath = __dirname + "/../../pem/id_rsa";
const publicFilePath = __dirname + "/../../pem/id_rsa.pub.cert";

// sails.log("Reading " + privateFilePath);
if (fs.existsSync(privateFilePath)) {
  var privateKey = fs.readFileSync(privateFilePath, "utf8");
} else {
  sails.log.error("Could not read file " + privateFilePath);
  throw new Error();
}

// sails.log("Reading " + publicFilePath);
if (fs.existsSync(publicFilePath)) {
  var publicKey = fs.readFileSync(publicFilePath, "utf8");
} else {
  sails.log.error("Could not read file " + publicFilePath);
  throw new Error();
}

// Generates a token from supplied payload
module.exports.issue = function(payload) {
  return jwt.sign(
    payload,
    privateKey,
    { expiresIn: "16h", algorithm: "RS256" }
  );
};

// Verifies token on a request
module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
    publicKey,
    { algorithms: ["RS256"] }, // For more info: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};
