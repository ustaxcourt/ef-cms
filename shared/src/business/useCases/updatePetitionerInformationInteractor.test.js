const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
} = require('../entities/cases/Case');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const {
  updatePetitionerInformationInteractor,
} = require('./updatePetitionerInformationInteractor');
const { docketClerkUser, MOCK_PRACTITIONER } = require('../../test/mockUsers');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');
const { UserCase } = require('../entities/UserCase');
jest.mock('./addCoversheetInteractor');
const { addCoverToPdf } = require('./addCoversheetInteractor');

describe('updatePetitionerInformationInteractor', () => {
  let mockUser;
  let mockCase;
  const PRIMARY_CONTACT_ID = '661beb76-f9f3-40db-af3e-60ab5c9287f6';
  const SECONDARY_CONTACT_ID = '56387318-0092-49a3-8cc1-921b0432bd16';

  const mockPetitioners = [
    {
      ...MOCK_CASE.petitioners[0],
      contactId: PRIMARY_CONTACT_ID,
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Primary Petitioner',
    },
    {
      ...MOCK_CASE.petitioners[0],
      contactId: SECONDARY_CONTACT_ID,
      contactType: CONTACT_TYPES.petitioner,
      name: 'Test Secondary Petitioner',
    },
  ];

  const basePractitioner = {
    ...MOCK_PRACTITIONER,
    representing: [mockPetitioners[0].contactId],
  };

  beforeAll(() => {
    addCoverToPdf.mockResolvedValue({
      pdfData: testPdfDoc,
    });

    applicationContext.getCurrentUser.mockImplementation(
      () => new User(mockUser),
    );
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'https://www.example.com',
      });

    applicationContext.getUseCaseHelpers().addExistingUserToCase = jest
      .fn()
      .mockImplementation(({ caseEntity }) => caseEntity);
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

  it('should throw an error when the user is a privatePractitioner not associated with the case', async () => {
    mockUser = {
      ...mockUser,
      role: ROLES.privatePractitioner,
      userId: 'a003e912-7b2f-4d2f-bf00-b99ec0d29de1',
    };

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: SECONDARY_CONTACT_ID,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });

  it('should throw an error when the user is a petitioner attempting to modify another petitioner', async () => {
    mockUser = {
      ...mockUser,
      role: ROLES.petitioner,
      userId: 'a003e912-7b2f-4d2f-bf00-b99ec0d29de1',
    };

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: SECONDARY_CONTACT_ID,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });

  it('should NOT throw an error when the user is a petitioner its own contact information', async () => {
    mockUser = {
      ...mockUser,
      role: ROLES.petitioner,
      userId: SECONDARY_CONTACT_ID,
    };

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: SECONDARY_CONTACT_ID,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.not.toThrow('Unauthorized for editing petition details');
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
          contactId: SECONDARY_CONTACT_ID,
          countryType: COUNTRY_TYPES.DOMESTIC,
        },
      }),
    ).rejects.toThrow(
      `Case with docketNumber ${mockCase.docketNumber} has not been served`,
    );
  });

  it('should throw an error when the contact to update is not valid', async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: mockPetitioners,
    };

    await expect(
      updatePetitionerInformationInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        updatedPetitionerData: {
          contactId: SECONDARY_CONTACT_ID,
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

  it('should update the primary petitioner contact when their info changes and serves the notice created', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...getContactPrimary(MOCK_CASE),
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
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: mockPetitioners,
      privatePractitioners: [],
    };

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

    const { caseToUpdate } =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];
    expect(getContactPrimary(caseToUpdate).address2).toBeUndefined();
  });

  it('should set filedBy to undefined on notice of change docket entry', async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: mockPetitioners,
      privatePractitioners: [],
    };

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
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: mockPetitioners,
    };

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
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
  });

  it('should not update contactPrimary email even when it is provided', async () => {
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[0],
        email: 'test2@example.com',
      },
    });

    expect(
      getContactPrimary(
        applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
          .caseToUpdate,
      ).email,
    ).not.toBe('test2@example.com');
  });

  it('should update secondaryContact.additionalName when it is passed in', async () => {
    mockCase = {
      ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };
    const mockAdditionalName = 'Tina Belcher';
    const mockSecondaryContact = getContactSecondary(mockCase);

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
      updatedPetitionerData: {
        ...mockSecondaryContact,
        additionalName: mockAdditionalName,
      },
    });

    const updatedPetitioners =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners;

    const updatedContactSecondary = updatedPetitioners.find(
      p => p.contactId === mockSecondaryContact.contactId,
    );
    expect(updatedContactSecondary.additionalName).toBe(mockAdditionalName);
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

  it('should throw an error when attempting to update contactPrimary.countryType to an invalid value', async () => {
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

  it("should not generate a notice of change address when contactPrimary's information is sealed", async () => {
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

  it("should not generate a notice of change address when contactSecondary's information is sealed", async () => {
    mockCase = {
      ...mockCase,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        mockPetitioners[0],
        { ...mockPetitioners[1], isAddressSealed: true },
      ],
    };

    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: {
        ...mockPetitioners[1],
        address1: 'A Changed Street',
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
        ...getContactPrimary(MOCK_CASE),
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

  it('should update the case even when no change of address or phone is detected', async () => {
    await updatePetitionerInformationInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      updatedPetitionerData: getContactPrimary(mockCase),
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  describe('createWorkItemForChange', () => {
    it('should create a work item for the NCA when the primary contact is unrepresented', async () => {
      mockCase = {
        ...mockCase,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [mockPetitioners[0]],
        privatePractitioners: [
          {
            ...basePractitioner,
            representing: ['6c5b79e0-2429-4ebc-8e9c-483d0282d4e0'],
          },
        ],
      };

      const result = await updatePetitionerInformationInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          updatedPetitionerData: {
            ...mockPetitioners[0],
            address1: 'A Changed Street',
          },
        },
      );

      const noticeOfChangeDocketEntryWithWorkItem =
        result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Primary Petitioner',
      );
    });

    it('should create a work item for the NCA when the secondary contact is unrepresented', async () => {
      mockCase = {
        ...mockCase,
        privatePractitioners: [
          {
            ...basePractitioner,
            representing: ['51c088b0-808e-4189-bb99-e76546befbfe'],
          },
        ],
      };

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

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });

    it('should NOT create a work item for the NCA when the primary contact is represented and their service preference is NOT paper', async () => {
      mockCase = {
        ...mockCase,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [mockPetitioners[0]],
        privatePractitioners: [
          { ...basePractitioner, representing: [PRIMARY_CONTACT_ID] },
        ],
      };

      const result = await updatePetitionerInformationInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          updatedPetitionerData: {
            ...mockPetitioners[0],
            address1: 'A Changed Street',
          },
        },
      );

      const noticeOfChangeDocketEntryWithWorkItem =
        result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');
      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).not.toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeUndefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Primary Petitioner',
      );
    });

    it('should NOT create a work item for the NCA when the secondary contact is represented and their service preference is NOT paper', async () => {
      mockCase = {
        ...mockCase,
        privatePractitioners: [
          { ...basePractitioner, representing: [SECONDARY_CONTACT_ID] },
        ],
      };

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

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).not.toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeUndefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });

    it('should create a work item for the NCA when the primary contact is represented and their service preference is paper', async () => {
      mockCase = {
        ...mockCase,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [mockPetitioners[0]],
        privatePractitioners: [
          { ...basePractitioner, representing: [PRIMARY_CONTACT_ID] },
        ],
      };

      const result = await updatePetitionerInformationInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          updatedPetitionerData: {
            ...mockPetitioners[0],
            address1: 'A Changed Street',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        },
      );

      const noticeOfChangeDocketEntryWithWorkItem =
        result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Primary Petitioner',
      );
    });

    it('should create a work item for the NCA when the secondary contact is represented and their service preference is paper', async () => {
      mockCase = {
        ...mockCase,
        privatePractitioners: [
          { ...basePractitioner, representing: [SECONDARY_CONTACT_ID] },
        ],
      };

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

      const noticeOfChangeDocketEntryWithWorkItem =
        result.updatedCase.docketEntries.find(d => d.eventCode === 'NCA');

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });

    it('should create a work item for the NCA when the primary contact is represented and a private practitioner on the case requests paper service', async () => {
      mockCase = {
        ...mockCase,
        privatePractitioners: [
          {
            ...basePractitioner,
            representing: [SECONDARY_CONTACT_ID],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      };

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

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });

    it('should create a work item for the NCA when the secondary contact is represented and a IRS practitioner on the case requests paper service', async () => {
      mockCase = {
        ...mockCase,
        irsPractitioners: [
          {
            barNumber: 'PT1234',
            email: 'practitioner1@example.com',
            name: 'Test IRS Practitioner',
            role: ROLES.irsPractitioner,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '899bbe4b-84ee-40a1-ad05-a1e2e8484c72',
          },
        ],
        privatePractitioners: [
          {
            ...basePractitioner,
            representing: [SECONDARY_CONTACT_ID],
          },
        ],
      };

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

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });
  });

  describe('update contactPrimary email', () => {
    it('should call the update addExistingUserToCase use case helper when the contactPrimary is adding an email address', async () => {
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

    it('should not call the update addExistingUserToCase use case helper when the contactPrimary is unchanged', async () => {
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

      applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase.mockImplementation(() => new UserCase(mockCase));

      applicationContext
        .getUseCaseHelpers()
        .createUserForContact.mockImplementation(() => new UserCase(mockCase));

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

      applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase.mockImplementation(() => new UserCase(mockCase));

      applicationContext
        .getUseCaseHelpers()
        .createUserForContact.mockImplementation(() => new UserCase(mockCase));

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
