exports.userMap = {
  docketclerk: {
    'custom:role': 'docketclerk',
    email: 'docketclerk',
    name: 'Test Docketclerk',
    role: 'docketclerk',
    section: 'petitions',
    userId: 'docketclerk',
  },
  docketclerk1: {
    'custom:role': 'docketclerk',
    email: 'docketclerk1',
    name: 'Test Docketclerk1',
    role: 'docketclerk',
    section: 'petitions',
    userId: 'docketclerk1',
  },
  petitionsclerk: {
    'custom:role': 'petitionsclerk',
    email: 'petitionsclerk',
    name: 'Test Petitionsclerk',
    role: 'petitionsclerk',
    section: 'petitions',
    userId: 'petitionsclerk',
  },
  petitionsclerk1: {
    'custom:role': 'petitionsclerk',
    email: 'petitionsclerk1',
    name: 'Test Petitionsclerk1',
    role: 'petitionsclerk',
    section: 'petitions',
    userId: 'petitionsclerk1',
  },
  respondent: {
    'custom:role': 'respondent',
    email: 'respondent',
    name: 'Test Respondent',
    role: 'respondent',
    section: 'petitions',
    userId: 'respondent',
  },
  seniorattorney: {
    'custom:role': 'seniorattorney',
    email: 'seniorattorney',
    name: 'Test Seniorattorney',
    role: 'seniorattorney',
    section: 'petitions',
    userId: 'seniorattorney',
  },
  taxpayer: {
    'custom:role': 'petitioner',
    email: 'taxpayer',
    name: 'Test Petitioner',
    role: 'petitioner',
    section: 'petitioner',
    userId: 'taxpayer',
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
