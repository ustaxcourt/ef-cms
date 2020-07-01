const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  updateCounselOnCaseInteractor,
} = require('./updateCounselOnCaseInteractor');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { MOCK_CASE } = require('../../../test/mockCase.js');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');

describe('updateCounselOnCaseInteractor', () => {
  const mockPrivatePractitioners = [
    new PrivatePractitioner({
      role: ROLES.privatePractitioner,
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    }),
    new PrivatePractitioner({
      role: ROLES.privatePractitioner,
      userId: '9d914ca2-7876-43a7-acfa-ccb645717e11',
    }),
    new PrivatePractitioner({
      role: ROLES.privatePractitioner,
      userId: '4cae261f-3653-4d2f-8d8c-31f03df62e54',
    }),
  ];

  const mockIrsPractitioners = [
    new IrsPractitioner({
      role: ROLES.irsPractitioner,
      userId: '9a4390b3-9d1a-4987-b918-312675956bcc',
    }),
    new IrsPractitioner({
      role: ROLES.irsPractitioner,
      userId: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
    }),
    new IrsPractitioner({
      role: ROLES.irsPractitioner,
      userId: 'dd60c66f-2f82-4f8f-824a-d15a3e8e49a3',
    }),
  ];

  const mockPetitioners = [
    {
      role: ROLES.petitioner,
      userId: 'aa335271-9a0f-4ad5-bcf1-3b89bd8b5dd6',
    },
  ];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
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
        userIdToUpdate: '9d914ca2-7876-43a7-acfa-ccb645717e11',
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
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userIdToUpdate: '9d914ca2-7876-43a7-acfa-ccb645717e11',
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
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userIdToUpdate: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
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
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userIdToUpdate: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
    });

    const updatedPractitioner = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.irsPractitioners.find(
        p => p.userId === '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
      );
    expect(updatedPractitioner.email).toBeUndefined();
    expect(updatedPractitioner.representingPrimary).toBe(true);
    expect(updatedPractitioner.representingSecondary).toBe(false);
    expect(updatedPractitioner.serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });

  it('throws an error if the userIdToUpdate is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      updateCounselOnCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userData: {
          email: 'petitioner@example.com',
        },
        userIdToUpdate: 'aa335271-9a0f-4ad5-bcf1-3b89bd8b5dd6',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });
});
