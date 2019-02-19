exports.userMap = {
  taxpayer: {
    userId: 'taxpayer',
    section: 'petitioner',
    name: 'Test Petitioner',
    'custom:role': 'petitioner',
    role: 'petitioner',
    email: 'taxpayer',
  },
  petitionsclerk: {
    userId: 'petitionsclerk',
    name: 'Test Petitionsclerk',
    section: 'petitions',
    'custom:role': 'petitionsclerk',
    role: 'petitionsclerk',
    email: 'petitionsclerk',
  },
  petitionsclerk1: {
    userId: 'petitionsclerk1',
    name: 'Test Petitionsclerk1',
    section: 'petitions',
    'custom:role': 'petitionsclerk',
    role: 'petitionsclerk',
    email: 'petitionsclerk1',
  },
  respondent: {
    userId: 'respondent',
    name: 'Test Respondent',
    section: 'petitions',
    'custom:role': 'respondent',
    role: 'respondent',
    email: 'respondent',
  },
  docketclerk: {
    userId: 'docketclerk',
    name: 'Test Docketclerk',
    section: 'petitions',
    'custom:role': 'docketclerk',
    role: 'docketclerk',
    email: 'docketclerk',
  },
  docketclerk1: {
    userId: 'docketclerk1',
    name: 'Test Docketclerk1',
    section: 'petitions',
    'custom:role': 'docketclerk',
    role: 'docketclerk',
    email: 'docketclerk1',
  },
  seniorattorney: {
    userId: 'seniorattorney',
    name: 'Test Seniorattorney',
    section: 'petitions',
    'custom:role': 'seniorattorney',
    role: 'seniorattorney',
    email: 'seniorattorney',
  },
};

/**
 * getUserById
 * @param userId
 * @returns {*}
 */
exports.getUserById = async ({ userId }) => {
  // TODO: should hit cognito to fetch the user data
  return exports.userMap[userId];
};
