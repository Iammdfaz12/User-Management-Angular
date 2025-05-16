const bcrypt = require("bcrypt");
var readLine = require("readline");

let rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

saltRounds = 10;

rl.stdoutMuted = true;

rl.question("Enter your password: ", function (password) {
  // Generating salt value
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.error("Error generating salt: ", err);
    } else {
      console.info(
        "\n==============================================================="
      );
      console.info("\n Salt generated successfully: ", salt);

      console.info(
        "\n==============================================================="
      );
    }
    // Hashing the password
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        console.error("Error hashing password: ", err);
      } else {
        console.info(
          "\n==============================================================="
        );
        console.info("\n Password hashed successfully: ", hash);
        console.info(
          "\n==============================================================="
        );
      }
    });
  });

  rl.close();
});

rl._writeToOutput = function (stringToWrite) {
  if (rl.stdoutMuted) {
    rl.output.write("*");
  } else {
    rl.output.write(stringToWrite);
  }
};
