import readline from 'readline';

import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';

const { ENV } = process.env;
const UserPoolCache = {};

/**
 * This function makes it easy to lookup the current version so that we can perform searches against it
 *
 * @param {String} environmentName The environment we are going to lookup the current color
 * @returns {String} The current version of the application
 */
export const getVersion = async () => {
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
 * Exit if any of the provided strings are not set as environment variables
 *
 * @param {Array<String>} requiredEnvVars Array of strings to check
 */
export const requireEnvVars = requiredEnvVars => {
  const envVars = Object.keys(process.env);
  let missing = '';
  for (const key of requiredEnvVars) {
    if (!envVars.includes(key) || !process.env[key]) {
      missing += `${missing.length > 0 ? ', ' : ''}${key}`;
    }
  }
  if (missing) {
    console.error(`Missing environment variable(s): ${missing}`);
    process.exit();
  }
};

/**
 * Simple function to help ensure that a value is truthy before allowing the process to continue
 *
 * @param {String} value The value to ensure is truthy
 * @param {String} message The message to relay if the value is not truthy
 */
export const checkEnvVar = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

/**
 * Ascertain the Cognito User Pool based on the current environment
 *
 * @param {Object} cognitoInstance (optional) instance of the CognitoIdentityServiceProvider
 * @returns {String} The unique identifier of the Cognito User Pool
 */
export const getUserPoolId = async cognitoInstance => {
  checkEnvVar(ENV, 'You must have ENV set in your local environment');

  if (UserPoolCache[ENV]) {
    return UserPoolCache[ENV];
  }

  const cognito =
    cognitoInstance ||
    new CognitoIdentityServiceProvider({ region: 'us-east-1' });
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
export const getClientId = async userPoolId => {
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
export const generatePassword = numChars => {
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
 * Wrapper for readline that asks a question and returns the input from stdin
 *
 * @param {String} query Question to ask
 * @returns {Promise<String>} The answer provided via stdin
 */
export const askQuestion = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }),
  );
};
