exports.userMap = {
  docketclerk: {
    'custom:role': 'docketclerk',
    email: 'docketclerk@example.com',
    name: 'Test Docketclerk',
    role: 'docketclerk',
    section: 'petitions',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  },
  docketclerk1: {
    'custom:role': 'docketclerk',
    email: 'docketclerk1@example.com',
    name: 'Test Docketclerk1',
    role: 'docketclerk',
    section: 'petitions',
    userId: '2805d1ab-18d0-43ec-bafb-654e83405416',
  },
  petitionsclerk: {
    'custom:role': 'petitionsclerk',
    email: 'petitionsclerk@example.com',
    name: 'Test Petitionsclerk',
    role: 'petitionsclerk',
    section: 'petitions',
    userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
  },
  petitionsclerk1: {
    'custom:role': 'petitionsclerk',
    email: 'petitionsclerk1@example.com',
    name: 'Test Petitionsclerk1',
    role: 'petitionsclerk',
    section: 'petitions',
    userId: '4805d1ab-18d0-43ec-bafb-654e83405416',
  },
  practitioner: {
    'custom:role': 'practitioner',
    email: 'taxpayer@example.com',
    name: 'Test Practitioner',
    role: 'practitioner',
    section: 'practitioner',
    userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
  },
  respondent: {
    'custom:role': 'respondent',
    email: 'respondent@example.com',
    name: 'Test Respondent',
    role: 'respondent',
    section: 'petitions',
    userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
  },
  seniorattorney: {
    'custom:role': 'seniorattorney',
    email: 'seniorattorney@example.com',
    name: 'Test Seniorattorney',
    role: 'seniorattorney',
    section: 'petitions',
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  },
  taxpayer: {
    'custom:role': 'petitioner',
    email: 'taxpayer@example.com',
    name: 'Test Petitioner',
    role: 'petitioner',
    section: 'petitioner',
    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
  },
};

const client = require('../../dynamodbClientService');

/**
 * getUserById
 * @param userId
 * @returns {*}
 */
exports.getUserById = async ({ applicationContext, userId }) => {
  return client.get({
    applicationContext,
    Key: {
      pk: userId,
      sk: userId,
    },
  });
};
