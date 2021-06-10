const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../entities/cases/Case');
const {
  saveCaseDetailInternalEditInteractor,
} = require('./saveCaseDetailInternalEditInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { omit } = require('lodash');

describe('updateCase', () => {
  const mockContactPrimaryId = '9565ed58-2a74-4dec-a34a-c87dde49f3c0';

  const mockCase = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.other,
    createdAt: applicationContext.getUtilities().createISODateString(),
    docketEntries: [
      {
        docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Petition',
        eventCode: 'P',
        filedBy: 'Test Petitioner',
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
        workItem: {
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            docketEntryId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            eventCode: 'P',
          },
          docketNumber: '56789-18',
          isInitializeCase: true,
          section: PETITIONS_SECTION,
          sentBy: 'petitioner',
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        },
      },
      {
        docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
      {
        docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Motion for Continuance',
        eventCode: 'M006',
        filedBy: 'Test Petitioner',
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
    ],
    docketNumber: '56789-18',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: mockContactPrimaryId,
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
    preferredTrialCity: 'Washington, District of Columbia',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  const petitionsClerkUser = {
    name: 'petitions clerk',
    role: ROLES.petitionsClerk,
    userId: '54cddcd9-d012-4874-b74f-73732c95d42b',
  };

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(petitionsClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should throw an error if caseToUpdate is not passed in', async () => {
    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('cannot process');
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: mockCase,
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should throw an error if the caseToUpdate passed in is an invalid case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'fee757df-666f-4ebe-94a0-7a342d438345',
    });

    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: omit({ ...mockCase }, 'caseCaption'),
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should update contactSecondary', async () => {
    const mockAddress = '1234 Something Lane';
    const mockCaseWithContactSecondary = {
      ...mockCase,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        ...mockCase.petitioners,
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactId: '41535712-c502-41a5-827c-26890e72733f',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
      ],
    };

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCaseWithContactSecondary,
          caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
          contactPrimary: getContactPrimary(mockCase),
          contactSecondary: {
            ...getContactSecondary(mockCaseWithContactSecondary),
            address1: mockAddress,
          },
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.petitioners[1].address1).toEqual(mockAddress);
  });

  it("should move the initialize case work item into the current user's in-progress box if the case is not paper", async () => {
    const caseToUpdate = Object.assign(mockCase);

    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
        contactPrimary: getContactPrimary(mockCase),
      },
      docketNumber: caseToUpdate.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      assigneeId: petitionsClerkUser.userId,
      assigneeName: petitionsClerkUser.name,
      caseIsInProgress: true,
    });
  });

  it('should not update work items if the case is paper', async () => {
    const caseToUpdate = Object.assign(mockCase);
    caseToUpdate.isPaper = true;
    caseToUpdate.mailingDate = 'yesterday';

    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...caseToUpdate,
        caseCaption: 'Iola Snow & Linda Singleton, Petitioners',
        contactPrimary: getContactPrimary(mockCase),
      },
      docketNumber: caseToUpdate.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toBeCalled();
  });

  it('should fail if the primary or secondary contact is empty', async () => {
    const caseToUpdate = Object.assign(mockCase);

    await expect(
      saveCaseDetailInternalEditInteractor(applicationContext, {
        caseToUpdate: {
          ...caseToUpdate,
          contactPrimary: null,
          contactSecondary: {},
        },
        docketNumber: caseToUpdate.docketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should remove a new initial filing document from the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);
    const mockRQT = {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
      documentType: 'Request for Place of Trial',
      eventCode: 'RQT',
      filedBy: 'Test Petitioner',
      userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [...mockCase.docketEntries, mockRQT],
        isPaper: true,
      });

    await saveCaseDetailInternalEditInteractor(applicationContext, {
      caseToUpdate: {
        ...mockCase,
        contactPrimary: getContactPrimary(mockCase),
        docketEntries: [...mockCase.docketEntries, mockRQT],
        isPaper: true,
        mailingDate: 'yesterday',
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateInitialFilingDocuments,
    ).toHaveBeenCalled();
  });

  it('should update which orders are needed', async () => {
    const caseToUpdate = Object.assign(mockCase);
    caseToUpdate.isPaper = true;
    caseToUpdate.orderDesignatingPlaceOfTrial = true;
    caseToUpdate.orderForAmendedPetition = true;
    caseToUpdate.orderForAmendedPetitionAndFilingFee = true;
    caseToUpdate.orderForFilingFee = true;
    caseToUpdate.orderForOds = true;
    caseToUpdate.orderForRatification = true;
    caseToUpdate.orderToShowCause = true;

    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...caseToUpdate,
          contactPrimary: getContactPrimary(mockCase),
        },
        docketNumber: caseToUpdate.docketNumber,
      },
    );

    expect(result.orderDesignatingPlaceOfTrial).toBeTruthy();
    expect(result.orderForAmendedPetition).toBeTruthy();
    expect(result.orderForAmendedPetitionAndFilingFee).toBeTruthy();
    expect(result.orderForFilingFee).toBeTruthy();
    expect(result.orderForOds).toBeTruthy();
    expect(result.orderForRatification).toBeTruthy();
    expect(result.orderToShowCause).toBeTruthy();
  });

  it('should not change contact primary contactId when saving case', async () => {
    const result = await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        caseToUpdate: {
          ...mockCase,
          contactPrimary: {
            ...getContactPrimary(mockCase),
          },
          petitioners: undefined,
        },
        docketNumber: mockCase.docketNumber,
      },
    );

    expect(result.petitioners[0].contactId).toEqual(
      mockCase.petitioners[0].contactId,
    );
  });
});
