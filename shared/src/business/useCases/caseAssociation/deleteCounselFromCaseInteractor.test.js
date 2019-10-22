const {
  deleteCounselFromCaseInteractor,
} = require('./deleteCounselFromCaseInteractor');
const { User } = require('../../entities/User');

let applicationContext;
let updateCaseMock;
let deleteUserFromCaseMock;

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

describe('deleteCounselFromCaseInteractor', () => {
  beforeEach(() => {
    updateCaseMock = jest.fn();
    deleteUserFromCaseMock = jest.fn();

    applicationContext = {
      getCurrentUser: () => ({
        role: User.ROLES.docketClerk,
        userId: '001',
      }),
      getPersistenceGateway: () => ({
        deleteUserFromCase: deleteUserFromCaseMock,
        getCaseByCaseId: ({ caseId }) => ({
          caseId,
          docketNumber: '123-19',
          practitioners: mockPractitioners,
          respondents: mockRespondents,
        }),
        getUserById: ({ userId }) => {
          return mockPractitioners
            .concat(mockRespondents)
            .find(user => user.userId === userId);
        },
        updateCase: updateCaseMock,
      }),
    };
  });

  it('deletes a practitioner with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userIdToDelete: '789',
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(deleteUserFromCaseMock).toHaveBeenCalled();
  });

  it('deletes a respondent with the given userId from the associated case', async () => {
    await deleteCounselFromCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userIdToDelete: '987',
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(deleteUserFromCaseMock).toHaveBeenCalled();
  });
});
