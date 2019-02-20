const { MOCK_DOCUMENTS } = require('./mockDocuments');

exports.MOCK_CASE = {
  docketNumber: '101-18',
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
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
