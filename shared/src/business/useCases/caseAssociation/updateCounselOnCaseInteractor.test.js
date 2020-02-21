const {
  updateCounselOnCaseInteractor,
} = require('./updateCounselOnCaseInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

let applicationContext;
let updateCaseMock;

const mockPractitioners = [
  { role: User.ROLES.practitioner, userId: '456' },
  { role: User.ROLES.practitioner, userId: '789' },
  { role: User.ROLES.practitioner, userId: '012' },
];

const mockRespondents = [
  { role: User.ROLES.respondent, userId: '654' },
  { role: User.ROLES.respondent, userId: '987' },
  { role: User.ROLES.respondent, userId: '210' },
];

const mockPetitioners = [{ role: User.ROLES.petitioner, userId: '111' }];

describe('updateCounselOnCaseInteractor', () => {
  beforeEach(() => {
    updateCaseMock = jest.fn().mockImplementation(v => v.caseToUpdate);

    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.docketClerk,
        userId: '001',
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: ({ caseId }) => ({
          caseCaption: 'Caption',
          caseId,
          caseType: 'Deficiency',
          docketNumber: '123-19',
          docketRecord: [
            {
              description: 'first record',
              documentId: '8675309b-18d0-43ec-bafb-654e83405411',
              eventCode: 'P',
              filingDate: '2018-03-01T00:01:00.000Z',
              index: 1,
            },
          ],
          documents: MOCK_CASE.documents,
          filingType: 'Myself',
          partyType: 'Petitioner',
          practitioners: mockPractitioners,
          preferredTrialCity: 'Fresno, California',
          procedureType: 'Regular',
          respondents: mockRespondents,
        }),
        getUserById: ({ userId }) => {
          return mockPractitioners
            .concat(mockRespondents)
            .concat(mockPetitioners)
            .find(user => user.userId === userId);
        },
        updateCase: updateCaseMock,
      }),
    };
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.petitioner,
      }),
    };
    let error;
    try {
      await updateCounselOnCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userData: {
          representingPrimary: true,
        },
        userIdToUpdate: '789',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Unauthorized');
  });

  it('updates a practitioner with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userData: {
        representingPrimary: true,
      },
      userIdToUpdate: '789',
    });

    expect(updateCaseMock).toHaveBeenCalled();
  });

  it('updates a respondent with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userData: {
        email: 'respondent@example.com',
      },
      userIdToUpdate: '987',
    });

    expect(updateCaseMock).toHaveBeenCalled();
  });

  it('throws an error if the userIdToUpdate is not a practitioner or respondent role', async () => {
    let error;
    try {
      await updateCounselOnCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userData: {
          email: 'petitioner@example.com',
        },
        userIdToUpdate: '111',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('User is not a practitioner or respondent');
  });
});
