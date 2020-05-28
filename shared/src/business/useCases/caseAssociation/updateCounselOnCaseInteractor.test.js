const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCounselOnCaseInteractor,
} = require('./updateCounselOnCaseInteractor');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');
const { User } = require('../../entities/User');

describe('updateCounselOnCaseInteractor', () => {
  const mockPrivatePractitioners = [
    new PrivatePractitioner({
      role: User.ROLES.privatePractitioner,
      userId: '456',
    }),
    new PrivatePractitioner({
      role: User.ROLES.privatePractitioner,
      userId: '789',
    }),
    new PrivatePractitioner({
      role: User.ROLES.privatePractitioner,
      userId: '012',
    }),
  ];

  const mockIrsPractitioners = [
    new IrsPractitioner({ role: User.ROLES.irsPractitioner, userId: '654' }),
    new IrsPractitioner({ role: User.ROLES.irsPractitioner, userId: '987' }),
    new IrsPractitioner({ role: User.ROLES.irsPractitioner, userId: '210' }),
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
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: 'domestic',
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
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
        representingSecondary: false,
        serviceIndicator: 'Electronic',
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
        representingPrimary: true,
        representingSecondary: false,
        serviceIndicator: 'Electronic',
      },
      userIdToUpdate: '987',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('updates only editable practitioner fields on the case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userData: {
        email: 'not.editable@example.com',
        representingPrimary: true,
        representingSecondary: false,
        serviceIndicator: 'Electronic',
      },
      userIdToUpdate: '987',
    });

    const updatedPractitioner = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.irsPractitioners.find(
        p => p.userId === '987',
      );
    expect(updatedPractitioner.email).toBeUndefined();
    expect(updatedPractitioner.representingPrimary).toBe(true);
    expect(updatedPractitioner.representingSecondary).toBe(false);
    expect(updatedPractitioner.serviceIndicator).toBe('Electronic');
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
