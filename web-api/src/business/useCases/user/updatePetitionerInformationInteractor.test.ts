/* eslint-disable max-lines */
import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  Case,
  getOtherFilers,
} from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { User } from '../../../../../shared/src/business/entities/User';
import { UserCase } from '../../../../../shared/src/business/entities/UserCase';
import { addCoverToPdf } from '../../../../../shared/src/business/useCases/addCoverToPdf';
import { addExistingUserToCase } from '../../useCaseHelper/caseAssociation/addExistingUserToCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { calculateISODate } from '../../../../../shared/src/business/utilities/DateHandler';
import { docketClerkUser } from '../../../../../shared/src/test/mockUsers';
import { updatePetitionerInformationInteractor } from './updatePetitionerInformationInteractor';
jest.mock('./addCoverToPdf');

describe('updatePetitionerInformationInteractor', () => {
  let mockUser;
  let mockCase;
  const PRIMARY_CONTACT_ID = MOCK_CASE.petitioners[0].contactId;

  const mockPetitioners = [
    {
      ...MOCK_CASE.petitioners[0],
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Primary Petitioner',
    },
    {
      ...MOCK_CASE.petitioners[0],
      contactId: '56387318-0092-49a3-8cc1-921b0432bd16',
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Secondary Petitioner',
    },
  ];
  let mockLock;

  beforeAll(() => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({});

    applicationContext.getCurrentUser.mockImplementation(
      () => new User(mockUser),
    );

    applicationContext
      .getUseCaseHelpers()
      .addExistingUserToCase.mockReturnValue(PRIMARY_CONTACT_ID);

    applicationContext
      .getUseCaseHelpers()
      .createUserForContact.mockImplementation(() => new UserCase(mockCase));
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    mockUser = docketClerkUser;

    mockCase = {
      ...MOCK_CASE,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('should throw an error when the user making the request does not have permission to edit petition details', async () => {
    mockUser = { ...mockUser, role: ROLES.petitioner };

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {},
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });

  it('should throw an error when the user making the request is a private practitioner not associated with the case', async () => {
    mockUser = { ...mockUser, role: ROLES.privatePractitioner };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCase,
        privatePractitioners: [{ representing: [], userId: '7' }],
      });

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {},
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });

  it('should not throw an error when the user making the request is a private practitioner who is associated with the case', async () => {
    const mockRepresentingId = '1a061240-1320-47c5-9f54-0ff975045d84';
    applicationContext.getCurrentUser.mockImplementationOnce(
      () =>
        new User({
          ...mockUser,
          role: ROLES.privatePractitioner,
          userId: mockRepresentingId,
        }),
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...mockCase,
        privatePractitioners: [
          {
            barNumber: 'EP0001',
            name: 'Example Practitioner',
            representing: [PRIMARY_CONTACT_ID],
            role: ROLES.privatePractitioner,
            userId: mockRepresentingId,
          },
        ],
      });

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).resolves.toBeDefined();
  });

  it('should throw an error when the petitioner to update can not be found on the case', async () => {
    const mockNotFoundContactId = 'cd37d820-cbde-4591-8b5a-dc74da12f2a2'; // this contactId is not on the case

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: mockNotFoundContactId,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.toThrow(
      `Case contact with id ${mockNotFoundContactId} was not found on the case`,
    );
  });

  it('should throw an error when the case status is new', async () => {
    mockCase = {
      ...mockCase,
      status: CASE_STATUS_TYPES.new,
    };

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: PRIMARY_CONTACT_ID,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.toThrow(
      `Case with docketNumber ${mockCase.docketNumber} has not been served`,
    );
  });

  it('should throw an error when the contact to update is not valid', async () => {
    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: PRIMARY_CONTACT_ID,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.toThrow('Case entity was invalid');

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('should update the petitioner contact when their info changes and serves the notice created', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        address1: 'changed address',
        contactId: mockPetitioners[0].contactId,
      },
    });

    const autoGeneratedDocument = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.documentType === 'Notice of Change of Address',
      );
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();
    expect(autoGeneratedDocument).toMatchObject({
      isAutoGenerated: true,
      isFileAttached: true,
      numberOfPages: mockNumberOfPages,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('should update contact information even when the update is changing a value to null', async () => {
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        address1: '989 Division St',
        city: 'Somewhere',
        contactId: mockPetitioners[0].contactId,
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Test Primary Petitioner',
        phone: '1234568',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        state: 'TN',
        title: 'Executor',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[0].address2,
    ).toBeUndefined();
  });

  it('should set filedBy to undefined on notice of change docket entry', async () => {
    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[1],
          address1: 'A Changed Street',
        },
      },
    );

    const noticeOfChangeDocketEntryWithWorkItem =
      result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

    expect(noticeOfChangeDocketEntryWithWorkItem.filedBy).toBeUndefined();
  });

  it('should update petitioner contact when secondary contact info changes, serves the generated notice, and returns the download URL for the paper notice if the contactSecondary was previously on the case', async () => {
    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[1],
          address1: 'A Changed Street',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      },
    );

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual('http://example.com/');
  });

  it('should not serve a document or return a paperServicePdfUrl when only the serviceIndicator for the petitioner changes but not the address', async () => {
    const result = await updatePetitionerInformationInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      },
    );

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
  });

  it('should not update petitioner email even when it is provided', async () => {
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        email: 'test2@example.com',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[0].email,
    ).not.toBe('test2@example.com');
  });

  it("should not update the user's paper petition email and e-service consent information", async () => {
    mockPetitioners[0].paperPetitionEmail = 'paperPetitionEmail@example.com';
    mockPetitioners[0].hasConsentedToEService = true;

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[0],
    ).toMatchObject({
      hasConsentedToEService: true,
      paperPetitionEmail: 'paperPetitionEmail@example.com',
    });
  });

  it('should update petitioner additionalName when it is passed in', async () => {
    const mockAdditionalName = 'Tina Belcher';

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        additionalName: mockAdditionalName,
      },
    });

    const updatedPetitioners =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners;

    expect(updatedPetitioners[0].additionalName).toBe(mockAdditionalName);
  });

  it('should update contactType', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };
    const otherFilerToUpdate = getOtherFilers(mockCase)[0];

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
      updatedPetitionerData: {
        ...otherFilerToUpdate,
        contactType: CONTACT_TYPES.otherPetitioner,
      },
    });

    const updatedPetitioners =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners;

    const updatedOtherFiler = updatedPetitioners.find(
      p => p.contactId === otherFilerToUpdate.contactId,
    );
    expect(updatedOtherFiler.contactType).toBe(CONTACT_TYPES.otherPetitioner);
  });

  it('should throw an error when attempting to update countryType to an invalid value', async () => {
    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          countryType: 'alien',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      }),
    ).rejects.toThrow('The Case entity was invalid');

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it("should not generate a notice of change address when petitioner's information is sealed", async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          ...mockCase.petitioners[0],
          isAddressSealed: true,
        },
      ],
    };

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockCase.petitioners[0],
        address1: '456 Center St TEST',
        isAddressSealed: true,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        address1: 'changed address',
        contactId: mockPetitioners[0].contactId,
        name: 'Test Person22222',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: 'Test Petitioner',
    });
  });

  it('should not generated a docket entry if case older than 6 months', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => ({
        ...mockCase,
        closedDate: '2018-01-01T05:00:00.000Z',
        status: 'Closed',
      }));
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        address1: 'changed address',
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
    ).not.toHaveBeenCalled();
  });

  it('should update the petitioner contact information, but not file and serve a docket entry if the case has been closed for MORE than 6 months', async () => {
    const dateFromTwoYearsAgo = calculateISODate({
      howMuch: -2,
      units: 'years',
    });
    const updatePetitionerSpy = jest.spyOn(Case.prototype, 'updatePetitioner');
    const addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

    mockCase = {
      ...MOCK_CASE,
      closedDate: dateFromTwoYearsAgo,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.closed,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        address1: 'changed address',
        contactId: mockPetitioners[0].contactId,
        name: 'Test Person22222',
      },
    });

    expect(updatePetitionerSpy).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
    expect(addDocketEntrySpy).not.toHaveBeenCalled();
  });

  it('should not generated a notice if user is missing an email (aka, they are a new unverified user)', async () => {
    const unverifiedNewPetitioner = {
      email: undefined,
      userId: applicationContext.getUniqueId(),
    };
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(unverifiedNewPetitioner);

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        email: undefined,
        updatedEmail: 'testing@example.com',
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
    ).not.toHaveBeenCalled();
  });

  it('should update the petitioner contact information and file and serve a docket entry if the case has been closed for LESS than 6 months', async () => {
    const dateFromTwoMonthsAgo = calculateISODate({
      howMuch: -2,
      units: 'months',
    });
    const updatePetitionerSpy = jest.spyOn(Case.prototype, 'updatePetitioner');
    const addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

    mockCase = {
      ...MOCK_CASE,
      closedDate: dateFromTwoMonthsAgo,
      petitioners: mockPetitioners,
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.closed,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        address1: 'changed address',
        contactId: mockPetitioners[0].contactId,
        name: 'Test Person22222',
      },
    });

    expect(updatePetitionerSpy).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
    ).toHaveBeenCalled();
    expect(addDocketEntrySpy).toHaveBeenCalled();
  });

  describe('admissions clerk adds a verified petitioner email', () => {
    const mockUpdatedEmail = 'changed-email@example.com';
    const foundMockVerifiedPetitioner = {
      email: mockUpdatedEmail,
      userId: applicationContext.getUniqueId(),
    };
    beforeAll(() => {
      const admissionsClerkUser = {
        email: 'admissionsclerk@example.com',
        entityName: 'User',
        name: 'Test Admissions Clerk',
        role: 'admissionsclerk',
        section: 'admissions',
        userId: '9d7d63b7-d7a5-4905-ba89-ef71bf30057f',
      };

      applicationContext.getCurrentUser.mockImplementation(
        () => new User(admissionsClerkUser),
      );

      applicationContext
        .getUserGateway()
        .getUserByEmail.mockReturnValue('someMockId');

      applicationContext
        .getPersistenceGateway()
        .getUserById.mockReturnValue(foundMockVerifiedPetitioner);

      applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase.mockImplementation(addExistingUserToCase); // the real implementation, but inside, it is using the mocks above
    });

    it('should call the update addExistingUserToCase use case helper when the petitioner is adding an email address', async () => {
      applicationContext
        .getUseCaseHelpers()
        .generateAndServeDocketEntry.mockReturnValue({
          changeOfAddressDocketEntry: new DocketEntry(
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
              docketNumber: '101-18',
              documentTitle: 'Petition',
              documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
              filedBy: 'Test Petitioner',
              filedByRole: ROLES.petitioner,
              filingDate: '2018-03-01T05:00:00.000Z',
              index: 1,
              isFileAttached: true,
              isOnDocketRecord: true,
              processingStatus: 'complete',
              receivedAt: '2018-03-01T05:00:00.000Z',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            { applicationContext },
          ),
        });

      await updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().addExistingUserToCase,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
      ).toHaveBeenCalledTimes(1);
      expect(
        applicationContext.getUseCaseHelpers().generateAndServeDocketEntry,
      ).toHaveBeenCalledTimes(1);
    });

    it('should not call the update addExistingUserToCase use case helper when the petitioner is unchanged', async () => {
      await updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: mockPetitioners[0],
      });

      expect(
        applicationContext.getUseCaseHelpers().addExistingUserToCase,
      ).not.toHaveBeenCalled();
    });

    it('should not call createUserForContact when the new email address is not available', async () => {
      applicationContext
        .getPersistenceGateway()
        .isEmailAvailable.mockImplementation(() => false);

      await updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: 'changed-email@example.com',
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().createUserForContact,
      ).not.toHaveBeenCalled();

      expect(
        applicationContext.getUseCaseHelpers().addExistingUserToCase,
      ).toHaveBeenCalled();
    });

    it('should call createUserForContact when the new email address is available', async () => {
      applicationContext
        .getPersistenceGateway()
        .isEmailAvailable.mockImplementation(() => true);

      await updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: 'changed-email@example.com',
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().createUserForContact,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getUseCaseHelpers().addExistingUserToCase,
      ).not.toHaveBeenCalled();
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: 'changed-email@example.com',
        },
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        updatedEmail: 'changed-email@example.com',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
