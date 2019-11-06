const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { updateCaseStatusInteractor } = require('./updateCaseStatusInteractor');
const { User } = require('../entities/User');

const MOCK_CASE = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  createdAt: new Date().toISOString(),
  docketNumber: '56789-18',
  documents: [
    {
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    },
    {
      documentId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    },
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    },
  ],
  filingType: 'Myself',
  hasIrsNotice: false,
  partyType: ContactFactory.PARTY_TYPES.petitioner,
  petitioners: [{ name: 'Test Petitioner' }],
  preferredTrialCity: 'Washington, D.C.',
  procedureType: 'Regular',
  status: 'New',
  userId: 'userId',
};

describe('updateCaseStatusInteractor', () => {
  let applicationContext;

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          userId: 'nope',
        };
      },
      getPersistenceGateway: () => {
        return {
          updateCase: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    let error;
    try {
      await updateCaseStatusInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseStatus: Case.STATUS_TYPES.cav,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });
});
