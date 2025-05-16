const { log, info } = require("console");
const { generateKeyPair } = require("crypto");
const { type } = require("os");
const { format } = require("path");

const certsFolder = "../config/certs/";

generateKeyPair(
  "rsa",
  {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  },
  (err, publicKey, privateKey) => {
    if (err) {
      console.log("Error generating keys: ", err);
      return;
    } else {
      var fs = require("fs");
      var publicStream = fs.createWriteStream(certsFolder + "/publicKey.pem");
      publicStream.write(publicKey, (err) => {
        if (err) {
          console.log("Error writing public key: ", err);
        } else {
          console.info("Public key is written successfully to file");
        }
      });
      publicStream.end();

      pirvateStream = fs.createWriteStream(certsFolder + "/privateKey.pem");
      pirvateStream.write(privateKey, (err) => {
        if (err) {
          console.log("Error writing private key: ", err);
        } else {
          console.info("Private key is written successfully to file");
        }
      });
      pirvateStream.end();
    }
  }
);
