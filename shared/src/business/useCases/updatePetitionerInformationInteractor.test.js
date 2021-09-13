const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const {
  updatePetitionerInformationInteractor,
} = require('./updatePetitionerInformationInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { docketClerkUser } = require('../../test/mockUsers');
const { getOtherFilers } = require('../entities/cases/Case');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');
const { UserCase } = require('../entities/UserCase');
jest.mock('./addCoversheetInteractor');
const { addCoverToPdf } = require('./addCoversheetInteractor');

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

  beforeAll(() => {
    addCoverToPdf.mockResolvedValue({});

    applicationContext.getCurrentUser.mockImplementation(
      () => new User(mockUser),
    );

    applicationContext
      .getUseCaseHelpers()
      .addExistingUserToCase.mockImplementation(({ caseEntity }) => caseEntity);

    applicationContext
      .getUseCaseHelpers()
      .createUserForContact.mockImplementation(() => new UserCase(mockCase));
  });

  beforeEach(() => {
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
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
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
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        url: 'https://www.example.com',
      });

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
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual('https://www.example.com');
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

  describe('update petitioner email', () => {
    it('should call the update addExistingUserToCase use case helper when the petitioner is adding an email address', async () => {
      await updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          ...mockPetitioners[0],
          updatedEmail: 'changed-email@example.com',
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().addExistingUserToCase,
      ).toHaveBeenCalled();

      expect(
        applicationContext.getPersistenceGateway().updateCase,
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
});
