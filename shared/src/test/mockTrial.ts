const {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} = require('../business/entities/EntityConstants');
const { MOCK_CASE } = require('./mockCase');

exports.MOCK_TRIAL_REMOTE = {
  chambersPhoneNumber: '1111111',
  joinPhoneNumber: '0987654321',
  judge: {
    name: 'Chief Judge',
    userId: '822366b7-e47c-413e-811f-d29113d09b06',
  },
  maxCases: 100,
  meetingId: '1234567890',
  password: 'abcdefg',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '48287e71-3754-4017-850d-476a663d1a8e',
};

exports.MOCK_TRIAL_REGULAR = {
  caseOrder: [{ docketNumber: MOCK_CASE.docketNumber }],
  isCalendared: false,
  judge: {
    name: 'Judge Yggdrasil',
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  },
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Regular',
  startDate: '2001-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
};

exports.MOCK_TRIAL_INPERSON = {
  address1: '123 Street Lane',
  caseOrder: [
    { docketNumber: MOCK_CASE.docketNumber },
    { docketNumber: '123-45' },
  ],
  city: 'Scottsburg',
  judge: {
    name: 'A Judge',
    userId: '55f4fc65-b33e-4c04-8561-3e56d533f386',
  },
  maxCases: 100,
  postalCode: '47130',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  state: 'IN',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

exports.MOCK_TRIAL_STANDALONE_REMOTE = {
  chambersPhoneNumber: '1111111',
  joinPhoneNumber: '0987654321',
  judge: {
    name: 'Chief Judge',
    userId: '822366b7-e47c-413e-811f-d29113d09b06',
  },
  maxCases: 100,
  meetingId: '1234567890',
  password: 'coolestPassword',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
  sessionType: 'Regular',
  startDate: '2021-06-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2021',
  trialSessionId: 'f74038af-d51e-4b90-810e-eeba65cda75f',
};
