const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { calculateISODate } = require('../../utilities/DateHandler');
const { docketClerkUser } = require('../../../test/mockUsers');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { MOCK_CASE } = require('../../../test/mockCase');
jest.mock('../addCoversheetInteractor', () => ({
  addCoverToPdf: jest.fn().mockReturnValue({
    pdfData: '',
  }),
}));

describe('generateChangeOfAddress', () => {
  const { docketNumber } = MOCK_CASE;
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
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
  };
  const mockCaseWithPrivatePractitioner = {
    ...MOCK_CASE,
    privatePractitioners: [mockPrivatePractitioner],
    status: CASE_STATUS_TYPES.generalDocket,
  };
  const getDocketEntryForNotice = cases => {
    return cases[0].docketEntries.find(entry =>
      entry.documentTitle.includes('Notice of Change'),
    );
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue([{ docketNumber }]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithPrivatePractitioner);

    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });
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
    expect(cases).toMatchObject([expect.objectContaining({ docketNumber })]);
  });

  it('should NOT run a change of address FOR "New" cases when address1 changes for a private practitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCaseWithPrivatePractitioner,
        status: CASE_STATUS_TYPES.new,
      });
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
    expect(cases).toMatchObject([
      expect.objectContaining({ docketNumber: MOCK_CASE.docketNumber }),
    ]);
  });

  it('should call applicationContext.logger.error and continue processing the next case if the case currently being processed is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValueOnce([
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
    expect(cases).toMatchObject([expect.objectContaining({ docketNumber })]);
  });

  it("should create a work item for an associated practitioner's notice of change of address when paper service is requested by a contact on the case", async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCaseWithPrivatePractitioner,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      });

    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const noticeDocketEntry = getDocketEntryForNotice(cases);

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(noticeDocketEntry.workItem).toBeDefined();
  });

  it("should NOT create a work item for an associated practitioner's notice of change of address when there is no paper service for the case", async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    });

    const noticeDocketEntry = getDocketEntryForNotice(cases);

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(noticeDocketEntry.workItem).toBeUndefined();
  });

  it('should not create a docket entry, work item, or serve anything if the bypassDocketEntry flag is true', async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: true,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: {
        ...mockPrivatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
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
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCaseWithPrivatePractitioner,
        closedDate: '1999-11-11T22:22:22.021Z',
        status: CASE_STATUS_TYPES.closed,
      });

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
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCaseWithPrivatePractitioner,
        closedDate: calculateISODate({
          howMuch: -1,
          units: 'months',
        }),
        status: CASE_STATUS_TYPES.closed,
      });

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

    const noticeDocketEntry = getDocketEntryForNotice(cases);

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(noticeDocketEntry).toBeDefined();
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

  it('should not create a docket entry or work item when a document type is not specified', async () => {
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue(undefined);

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

    const noticeDocketEntry = getDocketEntryForNotice(cases);

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(noticeDocketEntry).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });

  it('should update the practitioner serviceIndicator and email if the original practitioner did not have an email and a new one was added', async () => {
    const UPDATED_EMAIL = 'abc@example.com';
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
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
      });

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

  it('should use original case caption to create case title when creating work item', async () => {
    await generateChangeOfAddress({
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

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: 'Test Petitioner',
    });
  });
});
