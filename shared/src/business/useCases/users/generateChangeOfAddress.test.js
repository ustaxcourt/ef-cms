const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { calculateISODate } = require('../../utilities/DateHandler');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
jest.mock('../addCoversheetInteractor', () => ({
  addCoverToPdf: jest.fn().mockReturnValue({
    pdfData: '',
  }),
}));

describe('generateChangeOfAddress', () => {
  let mockCase;

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const mockIrsPractitioner = {
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
    email: 'irsPractitioner1@example.com',
    name: 'Test IRS Practitioner',
    representingPrimary: true,
    role: ROLES.irsPractitioner,
    section: 'irsPractitioner',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    userId: '35db9c50-0384-4830-a004-115001e86652',
  };

  const mockPrivatePractitioner = {
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
  };

  const mockCaseWithPrivatePractitioner = {
    ...MOCK_CASE,
    privatePractitioners: [mockPrivatePractitioner],
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  const mockCaseWithIrsPractitioner = {
    ...MOCK_CASE,
    irsPractitioners: [mockIrsPractitioner],
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  beforeEach(() => {
    mockCase = mockCaseWithPrivatePractitioner;

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue([
        { docketNumber: mockCaseWithPrivatePractitioner.docketNumber },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('should run a change of address when address1 changes for a private practitioner', async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it('should run a change of address when address1 changes for an irs practitioner', async () => {
    mockCase = mockCaseWithIrsPractitioner;
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue([
        { docketNumber: mockCaseWithIrsPractitioner.docketNumber },
      ]);

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '23456 Main St',
      },
      user: mockIrsPractitioner,
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
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: {},
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

  it('should NOT send a notification to the user if they have no associated cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValueOnce([]);

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: {},
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).not.toHaveBeenCalled();
  });

  it('should calculate the number of pages in the generated change of address pdf', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const changeOfAddressDocketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'NCA',
      );
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toBeCalledTimes(1);
    expect(changeOfAddressDocketEntry.isFileAttached).toEqual(true);
    expect(changeOfAddressDocketEntry.numberOfPages).toBe(mockNumberOfPages);
    expect(changeOfAddressDocketEntry.filedBy).toBeUndefined();
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
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const noticeOfChangeOfAddressDocument = cases[0].docketEntries.find(
      d => d.documentType === 'Notice of Change of Address',
    );
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(noticeOfChangeOfAddressDocument).toMatchObject({
      isAutoGenerated: true,
    });
  });

  it('should call applicationContext.logger.error and continue processing the next case if the case currently being processed is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue([
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
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    expect(applicationContext.logger.error).toBeCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toBeCalledTimes(1);
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it("should create a work item for an associated practitioner's notice of change of address when paper service is requested by the practitioner", async () => {
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        {
          ...MOCK_CASE.contactSecondary,
          contactType: CONTACT_TYPES.secondary,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: {
        ...mockPrivatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    });

    const docketEntryForNoticeOfChangeOfAddress = cases[0].docketEntries.find(
      entry => entry.documentTitle.includes('Notice of Change'),
    );
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(docketEntryForNoticeOfChangeOfAddress.workItem).toBeDefined();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it("should create a work item for an associated practitioner's notice of change of address when paper service is requested by a primary contact on the case", async () => {
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        {
          ...getContactPrimary(MOCK_CASE),
          contactType: CONTACT_TYPES.secondary,
          name: 'Test Secondary',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const docketEntryForNoticeOfChangeOfAddress = cases[0].docketEntries.find(
      entry => entry.documentTitle.includes('Notice of Change'),
    );
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(docketEntryForNoticeOfChangeOfAddress.workItem).toBeDefined();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it("should create a work item for an associated practitioner's notice of change of address when paper service is requested by a secondary contact on the case", async () => {
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        {
          ...getContactPrimary(MOCK_CASE),
          contactType: CONTACT_TYPES.secondary,
          name: 'Test Secondary',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const docketEntryForNoticeOfChangeOfAddress = cases[0].docketEntries.find(
      entry => entry.documentTitle.includes('Notice of Change'),
    );
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(docketEntryForNoticeOfChangeOfAddress.workItem).toBeDefined();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it("should NOT create a work item for an associated practitioner's the notice of change of address when there is no paper service for the case", async () => {
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        {
          ...MOCK_CASE.contactSecondary,
          contactType: CONTACT_TYPES.secondary,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const docketEntryForNoticeOfChangeOfAddress = cases[0].docketEntries.find(
      entry => entry.documentTitle.includes('Notice of Change'),
    );
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(docketEntryForNoticeOfChangeOfAddress.workItem).toBeUndefined();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it('should not create a docket entry, work item, or serve anything if the bypassDocketEntry flag is true', async () => {
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        {
          ...MOCK_CASE.contactSecondary,
          contactType: CONTACT_TYPES.secondary,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: true,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should not create a docket entry, work item, or serve anything if the case is closed more than six months ago, but it should still update the case', async () => {
    mockCase = {
      ...mockCase,
      closedDate: '1999-11-11T22:22:22.021Z',
      status: CASE_STATUS_TYPES.closed,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should create a docket entry, work item, and serve it if the case is closed less than six months ago, and it should still update the case', async () => {
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      closedDate: calculateISODate({
        howMuch: -1,
        units: 'months',
      }),
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        {
          ...getContactPrimary(MOCK_CASE),
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        {
          ...getContactPrimary(MOCK_CASE),
          contactType: CONTACT_TYPES.secondary,
          name: 'Test Secondary',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      status: CASE_STATUS_TYPES.closed,
    };

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const docketEntryForNoticeOfChangeOfAddress = cases[0].docketEntries.find(
      entry => entry.documentTitle.includes('Notice of Change'),
    );

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(docketEntryForNoticeOfChangeOfAddress).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should update the practitioner serviceIndicator and email if the original practitioner did not have an email and a new one was added', async () => {
    const UPDATED_EMAIL = 'abc@example.com';
    mockCase = {
      ...mockCaseWithPrivatePractitioner,
      closedDate: '1999-11-11T22:22:22.021Z',
      privatePractitioners: [
        {
          ...mockCaseWithPrivatePractitioner.privatePractitioners[0],
          email: undefined,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      status: CASE_STATUS_TYPES.closed,
    };

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
      },
      updatedEmail: UPDATED_EMAIL,
      user: {
        ...mockPrivatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.privatePractitioners[0],
    ).toMatchObject({
      email: UPDATED_EMAIL,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
  });
});
