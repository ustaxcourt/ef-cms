const { CognitoIdentityServiceProvider, DynamoDB } = require('aws-sdk');

const { ENV } = process.env;
const UserPoolCache = {};
const { v5: uuidv5 } = require('uuid');

/**
 * This function makes it easy to lookup the current version so that we can perform searches against it
 *
 * @param {String} environmentName The environment we are going to lookup the current color
 * @returns {String} The current version of the application
 */
const getVersion = async () => {
  checkEnvVar(ENV, 'You must have ENV set in your local environment');

  const dynamodb = new DynamoDB({ region: 'us-east-1' });
  const result = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: 'source-table-version',
        },
        sk: {
          S: 'source-table-version',
        },
      },
      TableName: `efcms-deploy-${ENV}`,
    })
    .promise();

  if (!result || !result.Item) {
    throw 'Could not determine the current version';
  }
  return result.Item.current.S;
};

/**
 * Simple function to help ensure that a value is truthy before allowing the process to continue
 *
 * @param {String} value The value to ensure is truthy
 * @param {String} message The message to relay if the value is not truthy
 */
const checkEnvVar = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

/**
 * Ascertain the Cognito User Pool based on the current environment
 *
 * @returns {String} The unique identifier of the Cognito User Pool
 */
const getUserPoolId = async () => {
  checkEnvVar(ENV, 'You must have ENV set in your local environment');

  if (UserPoolCache[ENV]) {
    return UserPoolCache[ENV];
  }

  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  UserPoolCache[ENV] = userPoolId;
  return UserPoolCache[ENV];
};

/**
 * Ascertain the Client ID for the Cognito User Pool we use to authenticate users
 *
 * @param {String} userPoolId The unique identifier of the Cognito User Pool
 * @returns {String} The unique identifier of the Cognito Client ID
 */
const getClientId = async userPoolId => {
  const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const results = await cognito
    .listUserPoolClients({
      MaxResults: 60,
      UserPoolId: userPoolId,
    })
    .promise();
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

/**
 * Generate a strong password that makes Cognito happy
 *
 * @param {Number} numChars Number of characters for the password
 * @returns {String} A strong password that is numChars long
 */
const generatePassword = numChars => {
  const pickRandomChar = src => {
    const rand = Math.floor(Math.random() * chars[src].length);
    return chars[src][rand];
  };
  const pickRandomType = () => {
    const rand = Math.floor(Math.random() * Object.keys(chars).length);
    return Object.keys(chars)[rand];
  };

  const chars = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  };
  const pass = [];

  for (const k of Object.keys(chars)) {
    pass.push(pickRandomChar(k));
  }

  for (let i = pass.length; i < numChars; i++) {
    const k = pickRandomType();
    pass.push(pickRandomChar(k));
  }
  return shuffle(pass).join('');
};

const shuffle = arr => {
  let currentIndex = arr.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
};

/**
 * This let's us fake a real email address because we do not want to
 * accidentally email someone in a testing environment
 *
 * @param {Object} providers
 * @param {String} domainToUse  This is the suffix email '@example.com' realEmail
 * @param {String} realEmail    The real email that we want to make into nonsense
 * @returns {String}            This is the faked email to use
 */
exports.fakeEmail = ({ domainToUse = 'example.com', realEmail }) => {
  const MY_NAMESPACE = '81f7d8bd-18e2-45ce-816a-6e22b66476a6';
  const faked = uuidv5(realEmail, MY_NAMESPACE);
  return [faked, '@', domainToUse].join('');
};

/**
 * This function replaces all of values for all of the keys that are named 'email'.
 *
 * @param {Object} obj The JSON Object to fix and fake emails
 * @returns {Object} The original object with all of the 'email' keys obfuscated.
 * @calls exports.fakeEmail
 */
exports.findAndMockEmails = jsonObj => {
  if (!jsonObj) {
    return jsonObj;
  }

  const obj = JSON.parse(JSON.stringify(jsonObj));
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object') {
      obj[k] = exports.findAndMockEmails(obj[k]);
    } else if (k === 'email') {
      obj[k] = exports.fakeEmail({ realEmail: obj[k] });
    }
  });
  return obj;
};

exports.checkEnvVar = checkEnvVar;
exports.generatePassword = generatePassword;
exports.getUserPoolId = getUserPoolId;
exports.getClientId = getClientId;
exports.getVersion = getVersion;
