const {
  addDocketEntryForPaymentStatus,
  serveCaseToIrsInteractor,
} = require('./serveCaseToIrsInteractor');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { Case, getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('serveCaseToIrsInteractor', () => {
  const MOCK_WORK_ITEM = {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseStatus: CASE_STATUS_TYPES.new,
    completedAt: '2018-12-27T18:06:02.968Z',
    completedBy: PARTY_TYPES.petitioner,
    completedByUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    createdAt: '2018-12-27T18:06:02.971Z',
    docketEntry: {
      createdAt: '2018-12-27T18:06:02.968Z',
      docketEntryId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    isInitializeCase: true,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: PARTY_TYPES.petitioner,
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition ready for review',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: ROLES.petitioner,
        to: null,
      },
    ],
    section: DOCKET_SECTION,
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  };

  let mockCase;
  let getObjectMock = () => {
    return {
      promise: async () => ({
        Body: testPdfDoc,
      }),
    };
  };

  beforeEach(() => {
    mockCase = { ...MOCK_CASE };
    mockCase.docketEntries[0].workItem = { ...MOCK_WORK_ITEM };
    applicationContext.getPersistenceGateway().updateWorkItem = jest.fn();

    applicationContext.getStorageClient.mockReturnValue({
      getObject: getObjectMock,
      upload: (params, cb) => {
        return cb(null, true);
      },
    });
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: 'www.example.com' });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);

    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockImplementation(
        (_applicationContext, { caseEntity, docketEntryId }) =>
          caseEntity.docketEntries.find(d => d.docketEntryId === docketEntryId),
      );
  });

  it('should throw unauthorized error when user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
    });

    await expect(
      serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add a coversheet to the served petition', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      replaceCoversheet: false,
    });
  });

  it('should replace coversheet on the served petition if the case is not paper', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    mockCase = { ...MOCK_CASE };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      replaceCoversheet: true,
    });
  });

  it('should preserve original case caption and docket number on the coversheet if the case is not paper', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    mockCase = { ...MOCK_CASE };

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      replaceCoversheet: true,
      useInitialData: true,
    });
  });

  it('should generate a second notice of receipt of petition when contactSecondary.address is different from contactPrimary.address', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        ...MOCK_CASE.petitioners,
        {
          address1: '123 Side St',
          city: 'Somewhere Else',
          contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner Secondary',
          phone: '1234547',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'TN',
          title: 'Executor',
        },
      ],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUtilities().getAddressPhoneDiff,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition.mock
        .calls[1][0].data.address,
    ).toMatchObject({
      address1: '123 Side St',
      name: 'Test Petitioner Secondary',
    });
  });

  it('should NOT generate a second notice of receipt of petition when contactSecondary.address is NOT different from contactPrimary.address', async () => {
    mockCase = {
      ...MOCK_CASE,
      contactSecondary: {
        ...getContactPrimary(MOCK_CASE),
        contactId: 'f30c6634-4c3d-4cda-874c-d9a9387e00e2',
        name: 'Test Petitioner Secondary',
      },
      isPaper: false,
      partyType: PARTY_TYPES.petitionerSpouse,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getUtilities().getAddressPhoneDiff,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalledTimes(1);
  });

  it('should have the same contact id on contactPrimary before and after serving the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.petitioners[0].contactId,
    ).toBe(MOCK_CASE.petitioners[0].contactId);
  });

  it('should generate a notice of receipt of petition document and upload it to s3', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().noticeOfReceiptOfPetition,
    ).toHaveBeenCalled();
  });

  it('should not return a paper service pdf when the case is electronic', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const result = await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toBeUndefined();
  });

  it('should return a paper service pdf when the case is paper', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const result = await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toBeDefined();
  });

  it('should mark the Petition docketEntry as served', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedCase =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate;
    expect(
      updatedCase.docketEntries.find(p => p.eventCode === 'P').servedAt,
    ).toBeDefined();
  });

  it('should set isOnDocketRecord true for all intially filed documents except for the petition and stin file', async () => {
    const mockCaseWithoutServedDocketEntries = {
      ...MOCK_CASE,
      docketEntries: [
        MOCK_CASE.docketEntries[0],
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'ea10afeb-f189-4657-a862-c607a091beaa',
          docketNumber: '101-18',
          documentTitle:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentTitle,
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          isFileAttached: true,
          processingStatus: 'pending',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };
    const mockCaseWithServedDocketEntries = {
      ...mockCaseWithoutServedDocketEntries,
      docketEntries: [
        MOCK_CASE.docketEntries[0],
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'ea10afeb-f189-4657-a862-c607a091beaa',
          docketNumber: '101-18',
          documentTitle:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentTitle,
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          index: 2,
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: 'pending',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(
        mockCaseWithoutServedDocketEntries,
      )
      .mockReturnValueOnce(mockCase)
      .mockReturnValueOnce(mockCaseWithServedDocketEntries)
      .mockReturnValueOnce(mockCaseWithServedDocketEntries);

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries,
    ).toMatchObject([
      {
        documentTitle: INITIAL_DOCUMENT_TYPES.petition.documentTitle,
        index: 1,
        isOnDocketRecord: true,
      },
      {
        documentTitle:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentTitle,
        index: 2,
        isOnDocketRecord: true,
      },
    ]);
  });

  it('should call serveCaseDocument for every intially filed document', async () => {
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial Flavortown, AR',
          documentType: 'Request for Place of Trial',
          eventCode: 'RPT',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APW',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUtilities().serveCaseDocument,
    ).toHaveBeenCalledTimes(Object.keys(INITIAL_DOCUMENT_TYPES).length);
  });

  it('should not call serveCaseDocument if an error occurs while adding a coversheet', async () => {
    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockRejectedValueOnce(new Error('bad!'));

    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial Flavortown, AR',
          documentType: 'Request for Place of Trial',
          eventCode: 'RPT',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await expect(
      serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUtilities().serveCaseDocument,
    ).not.toBeCalled();
  });

  it('should not call serveCaseDocument if an error occurs while updating docket number record', async () => {
    jest
      .spyOn(Case.prototype, 'updateDocketNumberRecord')
      .mockImplementation(() => {
        throw new Error('bad!');
      });

    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial Flavortown, AR',
          documentType: 'Request for Place of Trial',
          eventCode: 'RPT',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await expect(
      serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUtilities().serveCaseDocument,
    ).not.toBeCalled();

    jest.restoreAllMocks();
  });

  it('should not call serveCaseDocument if an error occurs while updating case caption docket record', async () => {
    jest
      .spyOn(Case.prototype, 'updateCaseCaptionDocketRecord')
      .mockImplementation(() => {
        throw new Error('bad!');
      });

    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial Flavortown, AR',
          documentType: 'Request for Place of Trial',
          eventCode: 'RPT',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await expect(
      serveCaseToIrsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUtilities().serveCaseDocument,
    ).not.toBeCalled();

    jest.restoreAllMocks();
  });
});

describe('addDocketEntryForPaymentStatus', () => {
  let user;

  beforeEach(() => {
    user = applicationContext.getCurrentUser();
  });

  it('adds a docketRecord for a paid petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitionPaymentDate: 'Today',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
      { applicationContext },
    );
    await addDocketEntryForPaymentStatus({
      applicationContext,
      caseEntity,
      user,
    });

    const addedDocketRecord = caseEntity.docketEntries.find(
      docketEntry => docketEntry.eventCode === 'FEE',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });

  it('adds a docketRecord for a waived petition payment', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [],
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: 'Today',
        petitioners: undefined,
      },
      { applicationContext },
    );
    await addDocketEntryForPaymentStatus({
      applicationContext,
      caseEntity,
      user,
    });

    const addedDocketRecord = caseEntity.docketEntries.find(
      docketEntry => docketEntry.eventCode === 'FEEW',
    );

    expect(addedDocketRecord).toBeDefined();
    expect(addedDocketRecord.filingDate).toEqual('Today');
  });
});
