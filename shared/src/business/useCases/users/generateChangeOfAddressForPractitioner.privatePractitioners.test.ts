import {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { calculateISODate } from '../../utilities/DateHandler';
import { docketClerkUser } from '../../../test/mockUsers';
import { generateChangeOfAddress } from './generateChangeOfAddress';

jest.mock('../addCoversheetInteractor', () => ({
  addCoverToPdf: jest.fn().mockReturnValue({
    pdfData: '',
  }),
}));

describe('generateChangeOfAddress', () => {
  const { docketNumber } = MOCK_CASE;
  const mockPrivatePractitioner = {
    admissionsDate: '2019-04-10',
    admissionsStatus: 'Active',
    barNumber: 'PT5432',
    birthYear: '2011',
    contact: {
      address1: '234 Main St!',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    email: 'irspractitioner1@example.com',
    employer: 'IRS',
    entityName: 'IrsPractitioner',
    firstName: 'rick',
    lastName: 'james',
    name: 'Test IRS Practitioner',
    originalBarState: 'FL',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    section: 'irsPractitioner',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    userId: '35db9c50-0384-4830-a004-115001e86652',
  };
  const mockCaseWithPrivatePractitioner = {
    ...MOCK_CASE,
    privatePractitioners: [mockPrivatePractitioner],
    status: CASE_STATUS_TYPES.generalDocket,
  };
  const getDocketEntryForNotice = theCase => {
    return theCase.docketEntries.find(entry =>
      entry.documentTitle.includes('Notice of Change'),
    );
  };

  beforeAll(() => {
    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );
  });
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue([{ docketNumber }]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithPrivatePractitioner);

    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });

    applicationContext
      .getPersistenceGateway()
      .setChangeOfAddressCaseAsDone.mockReturnValue({ remaining: 0 });
  });

  it('should run a change of address when address1 changes for a private practitioner', async () => {
    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    ).toMatchObject({
      docketNumber,
    });
  });

  it('should NOT run a change of address FOR "New" cases when address1 changes for a private practitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCaseWithPrivatePractitioner,
        status: CASE_STATUS_TYPES.new,
      });
    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
  });

  it('should call applicationContext.logger.error and continue processing the next case if the case currently being processed is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValueOnce([
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

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    } as any);

    expect(applicationContext.logger.error).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalledTimes(1);
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

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    } as any);

    const noticeDocketEntry = getDocketEntryForNotice(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    );

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(noticeDocketEntry.workItem).toBeDefined();
  });

  it("should NOT create a work item for an associated practitioner's notice of change of address when there is no paper service for the case", async () => {
    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    } as any);

    const noticeDocketEntry = getDocketEntryForNotice(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    );

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(noticeDocketEntry.workItem).toBeUndefined();
  });

  it('should not create a docket entry, work item, or serve anything if the bypassDocketEntry flag is true', async () => {
    await generateChangeOfAddress({
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
    } as any);

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
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

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockPrivatePractitioner.contact,
        address1: '234 Main St',
      },
      user: mockPrivatePractitioner,
    } as any);

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
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
    } as any);

    const noticeDocketEntry = getDocketEntryForNotice(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    );

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(noticeDocketEntry).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should not create a docket entry or work item when a document type is not specified', async () => {
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue(undefined);

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
    } as any);

    const noticeDocketEntry = getDocketEntryForNotice(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    );

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
    } as any);

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.privatePractitioners[0],
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
    } as any);

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: 'Test Petitioner',
    });
  });
});
