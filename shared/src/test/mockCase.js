const { MOCK_DOCUMENTS } = require('./mockDocuments');

exports.MOCK_CASE = {
  docketNumber: '101-18',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  hasIrsNotice: true,
  procedureType: 'Regular',
  filingType: 'Myself',
  partyType: 'Petitioner',
  contactPrimary: {
    name: 'Test Taxpayer',
    title: 'Executor',
  },
  status: 'New',
  preferredTrialCity: 'Washington, D.C.',
  documents: MOCK_DOCUMENTS,
};

exports.MOCK_CASE_WITHOUT_NOTICE = {
  docketNumber: '101-18',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  procedureType: 'Regular',
  filingType: 'Myself',
  partyType: 'Petitioner',
  contactPrimary: {
    name: 'Test Taxpayer',
    title: 'Executor',
  },
  status: 'New',
  preferredTrialCity: 'Washington, D.C.',
  documents: MOCK_DOCUMENTS,
};
