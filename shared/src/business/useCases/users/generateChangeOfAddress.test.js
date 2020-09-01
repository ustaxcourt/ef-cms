const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { MOCK_CASE } = require('../../../test/mockCase');
jest.mock('../addCoversheetInteractor', () => ({
  addCoverToPdf: jest.fn().mockReturnValue({
    pdfData: '',
  }),
}));

describe('generateChangeOfAddress', () => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();
  const mockCaseWithPrivatePractitioner = {
    ...MOCK_CASE,
    privatePractitioners: [
      {
        barNumber: 'PT5432',
        contact: {
          address1: '234 Main St!',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner1@example.com',
        name: 'Test Private Practitioner',
        representingPrimary: true,
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
      },
    ],
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseIdsByUser.mockReturnValue([
        mockCaseWithPrivatePractitioner.docketNumber,
      ]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithPrivatePractitioner);
  });

  it('attempts to run a change of address when address1 changes', async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      user: {
        barNumber: 'PT5432',
        contact: {
          address1: '234 Main St!',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner1',
        name: 'Test Private Practitioner',
        representingPrimary: true,
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
      },
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it('should send a notification to the user initially and after each case is updated', async () => {
    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      user: {
        barNumber: 'PT5432',
        contact: {
          address1: '234 Main St!',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner1',
        name: 'Test Private Practitioner',
        representingPrimary: true,
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
      },
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(2);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toEqual({
      action: 'user_contact_update_progress',
      completedCases: 0,
      totalCases: 1,
    });
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message,
    ).toEqual({
      action: 'user_contact_update_progress',
      completedCases: 1,
      totalCases: 1,
    });
  });

  it('should set isAutoGenerated to true on the generated "Notice of Change of Address" document', async () => {
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      user: {
        barNumber: 'PT5432',
        contact: {
          address1: '234 Main St!',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner1',
        name: 'Test Private Practitioner',
        representingPrimary: true,
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
      },
    });

    const noticeOfChangeOfAddressDocument = cases[0].documents.find(
      d => d.documentType === 'Notice of Change of Address',
    );

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(noticeOfChangeOfAddressDocument).toMatchObject({
      isAutoGenerated: true,
    });
  });

  it('should notify honeybadger and continue processing the next case if the case currently being processed is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseIdsByUser.mockReturnValue([
        { ...mockCaseWithPrivatePractitioner, docketNumber: undefined },
        mockCaseWithPrivatePractitioner,
      ]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCaseWithPrivatePractitioner,
        docketNumber: undefined,
      })
      .mockReturnValueOnce(mockCaseWithPrivatePractitioner);

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: COUNTRY_TYPES.DOMESTIC,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      user: {
        barNumber: 'PT5432',
        contact: {
          address1: '234 Main St!',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: COUNTRY_TYPES.DOMESTIC,
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner1',
        name: 'Test Private Practitioner',
        representingPrimary: true,
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
      },
    });

    expect(applicationContext.notifyHoneybadger).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toBeCalledTimes(1);
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  // it.only('updates the user and privatePractitioners in the case but does not update cases that have been closed for more than 6 months', async () => {
  //   const lastYear = calculateISODate({
  //     dateString: createISODateString(),
  //     howMuch: -1,
  //     units: 'years',
  //   });
  //   const yesterday = calculateISODate({
  //     dateString: createISODateString(),
  //     howMuch: -1,
  //     units: 'days',
  //   });
  //   mockCase = [
  //     {
  //       ...MOCK_CASE,
  //       privatePractitioners: [
  //         {
  //           barNumber: 'BN8765',
  //           contact: {},
  //           role: ROLES.privatePractitioner,
  //           userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //         },
  //       ],
  //     },
  //     {
  //       ...MOCK_CASE,
  //       closedDate: lastYear,
  //       privatePractitioners: [
  //         {
  //           barNumber: 'BN8765',
  //           contact: {},
  //           role: ROLES.privatePractitioner,
  //           userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //         },
  //       ],
  //       status: CASE_STATUS_TYPES.closed,
  //     },
  //     {
  //       ...MOCK_CASE,
  //       closedDate: yesterday,
  //       privatePractitioners: [
  //         {
  //           barNumber: 'BN8765',
  //           contact: {},
  //           role: ROLES.privatePractitioner,
  //           userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //         },
  //       ],
  //       status: CASE_STATUS_TYPES.closed,
  //     },
  //   ];

  //   await updateUserContactInformationInteractor({
  //     applicationContext,
  //     contactInfo,
  //     userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //   });

  //   expect(
  //     applicationContext.getPersistenceGateway().updateUser,
  //   ).toHaveBeenCalled();

  //   expect(
  //     applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
  //       .user,
  //   ).toMatchObject({
  //     contact: contactInfo,
  //   });
  //   expect(
  //     applicationContext.getPersistenceGateway().updateCase,
  //   ).toHaveBeenCalled();
  //   expect(
  //     applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
  //   ).toEqual(2);
  //   expect(
  //     applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
  //       .caseToUpdate,
  //   ).toMatchObject({
  //     privatePractitioners: [
  //       {
  //         barNumber: 'BN8765',
  //         contact: contactInfo,
  //         role: ROLES.privatePractitioner,
  //         userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //       },
  //     ],
  //   });
  //   expect(
  //     applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
  //       .caseToUpdate,
  //   ).toMatchObject({
  //     privatePractitioners: [
  //       {
  //         barNumber: 'BN8765',
  //         contact: contactInfo,
  //         role: ROLES.privatePractitioner,
  //         userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //       },
  //     ],
  //   });
  // });

  // it('includes the practitioner name in the change of address document when the practitioner changes their address', async () => {
  //   user = MOCK_USERS['330d4b65-620a-489d-8414-6623653ebc4f'];

  //   mockCase = [
  //     {
  //       ...MOCK_CASE,
  //     },
  //   ];

  //   await updateUserContactInformationInteractor({
  //     applicationContext,
  //     contactInfo,
  //     userId: user.userId,
  //   });

  //   const updatedCase = applicationContext.getPersistenceGateway().updateCase
  //     .mock.calls[0][0].caseToUpdate;

  //   expect(
  //     updatedCase.documents[updatedCase.documents.length - 1],
  //   ).toMatchObject({
  //     additionalInfo: 'for Private Practitioner',
  //     documentTitle: 'Notice of Change of Address',
  //     filedBy: 'Counsel Private Practitioner',
  //   });
  // });

  // it('includes the irsPractitioner in the change of address document when the irsPractitioner changes their address', async () => {
  //   mockCase = [
  //     {
  //       ...MOCK_CASE,
  //     },
  //   ];

  //   await updateUserContactInformationInteractor({
  //     applicationContext,
  //     contactInfo,
  //     userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
  //   });

  //   const updatedCase = applicationContext.getPersistenceGateway().updateCase
  //     .mock.calls[0][0].caseToUpdate;
  //   expect(
  //     updatedCase.documents[updatedCase.documents.length - 1],
  //   ).toMatchObject({
  //     additionalInfo: 'for IRS Practitioner',
  //     documentTitle: 'Notice of Change of Address',
  //     filedBy: 'Resp.',
  //   });
  // });
});
