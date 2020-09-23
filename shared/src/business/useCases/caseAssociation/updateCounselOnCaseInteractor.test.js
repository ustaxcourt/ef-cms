const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
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
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    }),
    new PrivatePractitioner({
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: '9d914ca2-7876-43a7-acfa-ccb645717e11',
    }),
    new PrivatePractitioner({
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: '4cae261f-3653-4d2f-8d8c-31f03df62e54',
    }),
  ];

  const mockIrsPractitioners = [
    new IrsPractitioner({
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: '9a4390b3-9d1a-4987-b918-312675956bcc',
    }),
    new IrsPractitioner({
      barNumber: 'BN5678',
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
    }),
    new IrsPractitioner({
      barNumber: 'BN5432',
      name: 'Saul Goodman',
      role: ROLES.irsPractitioner,
      userId: 'dd60c66f-2f82-4f8f-824a-d15a3e8e49a3',
    }),
  ];

  const mockPetitioners = [
    {
      name: 'Saul Goodman',
      role: ROLES.petitioner,
      userId: 'aa335271-9a0f-4ad5-bcf1-3b89bd8b5dd6',
    },
  ];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Saul Goodman',
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
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => ({
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.deficiency,
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        docketEntries: MOCK_CASE.docketEntries,
        docketNumber,
        filingType: 'Myself',
        irsPractitioners: mockIrsPractitioners,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Fresno, California',
        privatePractitioners: mockPrivatePractitioners,
        procedureType: 'Regular',
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      }));
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCounselOnCaseInteractor({
        applicationContext,
        docketNumber: '123-19',
        userData: {
          representingPrimary: true,
        },
        userId: '9d914ca2-7876-43a7-acfa-ccb645717e11',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates a practitioner with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      docketNumber: '123-19',
      userData: {
        name: 'Saul Goodman',
        representingPrimary: true,
        representingSecondary: false,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: '9d914ca2-7876-43a7-acfa-ccb645717e11',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('updates an irsPractitioner with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      docketNumber: '123-19',
      userData: {
        name: 'Saul Goodman',
        representingPrimary: true,
        representingSecondary: false,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('updates only editable practitioner fields on the case', async () => {
    await updateCounselOnCaseInteractor({
      applicationContext,
      docketNumber: '123-19',
      userData: {
        email: 'not.editable@example.com',
        name: 'Saul Goodman',
        representingPrimary: true,
        representingSecondary: false,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
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

  it('throws an error if the userId is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      updateCounselOnCaseInteractor({
        applicationContext,
        docketNumber: '123-19',
        userData: {
          email: 'petitioner@example.com',
        },
        userId: 'aa335271-9a0f-4ad5-bcf1-3b89bd8b5dd6',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });
});
