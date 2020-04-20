const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCounselOnCaseInteractor,
} = require('./updateCounselOnCaseInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { User } = require('../../entities/User');

describe('updateCounselOnCaseInteractor', () => {
  const mockPrivatePractitioners = [
    { role: User.ROLES.privatePractitioner, userId: '456' },
    { role: User.ROLES.privatePractitioner, userId: '789' },
    { role: User.ROLES.privatePractitioner, userId: '012' },
  ];

  const mockIrsPractitioners = [
    { role: User.ROLES.irsPractitioner, userId: '654' },
    { role: User.ROLES.irsPractitioner, userId: '987' },
    { role: User.ROLES.irsPractitioner, userId: '210' },
  ];

  const mockPetitioners = [{ role: User.ROLES.petitioner, userId: '111' }];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: '001',
    });
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(({ userId }) => {
        return mockPrivatePractitioners
          .concat(mockIrsPractitioners)
          .concat(mockPetitioners)
          .find(user => user.userId === userId);
      });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => ({
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
        irsPractitioners: mockIrsPractitioners,
        partyType: 'Petitioner',
        preferredTrialCity: 'Fresno, California',
        privatePractitioners: mockPrivatePractitioners,
        procedureType: 'Regular',
      }));
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCounselOnCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userData: {
          representingPrimary: true,
        },
        userIdToUpdate: '789',
      }),
    ).rejects.toThrow('Unauthorized');
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

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('updates an irsPractitioner with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userData: {
        email: 'irsPractitioner@example.com',
      },
      userIdToUpdate: '987',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('throws an error if the userIdToUpdate is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      updateCounselOnCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userData: {
          email: 'petitioner@example.com',
        },
        userIdToUpdate: '111',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });
});
