import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { IrsPractitioner } from '../../entities/IrsPractitioner';
import { MOCK_CASE } from '../../../test/mockCase.ts';
import { PrivatePractitioner } from '../../entities/PrivatePractitioner';
import { applicationContext } from '../../test/createTestApplicationContext';
import { updateCounselOnCaseInteractor } from './updateCounselOnCaseInteractor';

describe('updateCounselOnCaseInteractor', () => {
  const mockPrivatePractitioners = [
    new PrivatePractitioner({
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      representing: ['9d914ca2-7876-43a7-acfa-ccb645717e11'],
      role: ROLES.privatePractitioner,
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    }),
    new PrivatePractitioner({
      barNumber: 'BN1234',
      name: 'Saul Goodman',
      role: ROLES.privatePractitioner,
      userId: 'bbb14ca2-7876-43a7-acfa-ccb645717e11',
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
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.deficiency,
        docketEntries: MOCK_CASE.docketEntries,
        docketNumber: '123-19',
        filingType: 'Myself',
        irsPractitioners: mockIrsPractitioners,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactId: '9d914ca2-7876-43a7-acfa-ccb645717e11',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'fieri@example.com',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
            state: 'CA',
          },
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactId: '3d914ca2-7876-43a7-acfa-ccb645717e11',
            contactType: CONTACT_TYPES.secondary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            state: 'CA',
          },
        ],
        preferredTrialCity: 'Fresno, California',
        privatePractitioners: [mockPrivatePractitioners[0]],
        procedureType: 'Regular',
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      });
  });

  it('returns an unauthorized error for a petitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCounselOnCaseInteractor(applicationContext, {
        docketNumber: '123-19',
        userData: {
          representing: ['aa335271-9a0f-4ad5-bcf1-3b89bd8b5dd6'],
        },
        userId: 'bbb14ca2-7876-43a7-acfa-ccb645717e11',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates a practitioner with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor(applicationContext, {
      docketNumber: '123-19',
      userData: {
        name: 'Saul Goodman',
        representing: [
          '9d914ca2-7876-43a7-acfa-ccb645717e11',
          '3d914ca2-7876-43a7-acfa-ccb645717e11',
        ],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    });

    expect(
      applicationContext.getPersistenceGateway().updatePrivatePractitionerOnCase
        .mock.calls[0][0].userId,
    ).toBe('e23e2d08-561b-4930-a2e0-1f342a481268');
  });

  it('updates an irsPractitioner with the given userId on the associated case', async () => {
    await updateCounselOnCaseInteractor(applicationContext, {
      docketNumber: '123-19',
      userData: {
        name: 'Saul Goodman',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: '76c86b6b-6aad-4128-8fa2-53c5735cc0af',
    });

    expect(
      applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase
        .mock.calls[0][0].userId,
    ).toBe('76c86b6b-6aad-4128-8fa2-53c5735cc0af');
  });

  it('updates only editable practitioner fields on the case', async () => {
    await updateCounselOnCaseInteractor(applicationContext, {
      docketNumber: '123-19',
      userData: {
        email: 'not.editable@example.com',
        name: 'Saul Goodman II',
        representing: [
          '9d914ca2-7876-43a7-acfa-ccb645717e11',
          '3d914ca2-7876-43a7-acfa-ccb645717e11',
        ],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    });

    expect(
      applicationContext.getPersistenceGateway().updatePrivatePractitionerOnCase
        .mock.calls[0][0].userId,
    ).toBe('e23e2d08-561b-4930-a2e0-1f342a481268');
    expect(
      applicationContext.getPersistenceGateway().updatePrivatePractitionerOnCase
        .mock.calls[0][0].practitioner,
    ).toMatchObject({
      email: undefined,
      name: 'Saul Goodman',
      representing: [
        '9d914ca2-7876-43a7-acfa-ccb645717e11',
        '3d914ca2-7876-43a7-acfa-ccb645717e11',
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('updates the service indicator on the contacts when they are being represented', async () => {
    await updateCounselOnCaseInteractor(applicationContext, {
      docketNumber: '123-19',
      userData: {
        email: 'not.editable@example.com',
        name: 'Saul Goodman',
        representing: [
          '9d914ca2-7876-43a7-acfa-ccb645717e11',
          '3d914ca2-7876-43a7-acfa-ccb645717e11',
        ],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[0].serviceIndicator,
    ).toBe(SERVICE_INDICATOR_TYPES.SI_NONE);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[1].serviceIndicator,
    ).toBe(SERVICE_INDICATOR_TYPES.SI_NONE);
  });

  it('reverts the service indicator on the contacts when they are no longer being represented', async () => {
    await updateCounselOnCaseInteractor(applicationContext, {
      docketNumber: '123-19',
      userData: {
        email: 'not.editable@example.com',
        name: 'Saul Goodman',
        representing: [],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      userId: 'e23e2d08-561b-4930-a2e0-1f342a481268',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[0].serviceIndicator,
    ).toBe(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[1].serviceIndicator,
    ).toBe(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });

  it('throws an error if the userId is not a privatePractitioner or irsPractitioner role', async () => {
    await expect(
      updateCounselOnCaseInteractor(applicationContext, {
        docketNumber: '123-19',
        userData: {
          email: 'petitioner@example.com',
        },
        userId: 'aa335271-9a0f-4ad5-bcf1-3b89bd8b5dd6',
      }),
    ).rejects.toThrow('User is not a practitioner');
  });
});
