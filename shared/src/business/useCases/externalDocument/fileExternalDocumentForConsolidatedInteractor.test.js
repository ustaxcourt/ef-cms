const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  fileExternalDocumentForConsolidatedInteractor,
} = require('./fileExternalDocumentForConsolidatedInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('fileExternalDocumentForConsolidatedInteractor', () => {
  let caseRecords;

  const docketNumber0 = '101-19';
  const docketNumber1 = '102-19';
  const docketNumber2 = '103-19';
  const docketEntryId0 = 'd0d0d0d0-b37b-479d-9201-067ec6e335bb';
  const docketEntryId1 = 'd1d1d1d1-b37b-479d-9201-067ec6e335bb';
  const docketEntryId2 = 'd2d2d2d2-b37b-479d-9201-067ec6e335bb';
  const docketEntryId3 = 'd3d3d3d3-b37b-479d-9201-067ec6e335bb';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });
  beforeEach(() => {
    caseRecords = [
      {
        caseCaption: 'Guy Fieri, Petitioner',
        caseType: CASE_TYPES_MAP.deficiency,
        createdAt: '2019-04-19T17:29:13.120Z',
        docketEntries: MOCK_CASE.docketEntries,
        docketNumber: docketNumber0,
        filingType: 'Myself',
        leadDocketNumber: docketNumber0,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'fieri@example.com',
            name: 'Guy Fieri',
            phone: '1234567890',
            postalCode: '12345',
            state: 'CA',
          },
        ],
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        role: ROLES.petitioner,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
      {
        caseCaption: 'Enzo Ferrari, Petitioner',
        caseType: CASE_TYPES_MAP.deficiency,
        createdAt: '2019-04-19T17:29:13.120Z',
        docketEntries: MOCK_CASE.docketEntries,
        docketNumber: docketNumber1,
        filingType: 'Myself',
        leadDocketNumber: docketNumber0,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'ferrari@example.com',
            name: 'Enzo Ferrari',
            phone: '1234567890',
            postalCode: '12345',
            state: 'CA',
          },
        ],
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        role: ROLES.petitioner,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
      {
        caseCaption: 'George Foreman, Petitioner',
        caseType: CASE_TYPES_MAP.deficiency,
        createdAt: '2019-04-19T17:29:13.120Z',
        docketEntries: MOCK_CASE.docketEntries,
        docketNumber: docketNumber2,
        filingType: 'Myself',
        leadDocketNumber: docketNumber0,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            address1: '123 Main St',
            city: 'Somewhere',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'foreman@example.com',
            name: 'George Foreman',
            phone: '1234567890',
            postalCode: '12345',
            state: 'CA',
          },
        ],
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        role: ROLES.petitioner,
        userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
    ];

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Guy Fieri',
      role: ROLES.admin,
      userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Guy Fieri',
      role: ROLES.admin,
      userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockReturnValue(caseRecords);
  });

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileExternalDocumentForConsolidatedInteractor(applicationContext, {
        documentMetadata: {},
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should associate the document with all selected cases from the consolidated set', async () => {
    expect(caseRecords[0].docketEntries.length).toEqual(4);
    expect(caseRecords[1].docketEntries.length).toEqual(4);
    expect(caseRecords[2].docketEntries.length).toEqual(4);

    const result = await fileExternalDocumentForConsolidatedInteractor(
      applicationContext,
      {
        docketNumbersForFiling: ['101-19', '102-19'],
        documentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          primaryDocumentId: docketEntryId0,
        },
        leadDocketNumber: docketNumber0,
      },
    );

    expect(result[0].docketEntries[4].docketEntryId).toEqual(docketEntryId0);
    expect(result[1].docketEntries[4].docketEntryId).toEqual(docketEntryId0);
    expect(result[0].docketEntries[4].isOnDocketRecord).toEqual(true);
    expect(result[1].docketEntries[4].isOnDocketRecord).toEqual(true);
    expect(result[2].docketEntries.length).toEqual(4);
  });

  // skipping this test until we have better acceptance criteria about consolidated cases
  // eslint-disable-next-line
  it.skip('should aggregate the filing parties for the docket record entry', async () => {
    await fileExternalDocumentForConsolidatedInteractor(applicationContext, {
      docketEntryIds: [docketEntryId0],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
      },
      filingPartyNames: ['Guy Fieri', 'Enzo Ferrari'],
      leadDocketNumber: docketNumber0,
    });
  });

  it('should generate only ONE QC work item for the filing, to be found on the document of the lowest docket number case to be filed in', async () => {
    const result = await fileExternalDocumentForConsolidatedInteractor(
      applicationContext,
      {
        docketNumbersForFiling: ['101-19', '102-19'],
        documentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          primaryDocumentId: docketEntryId0,
        },
        leadDocketNumber: docketNumber0,
      },
    );

    const lowestDocketNumberCase = result.find(
      record => record.docketNumber === docketNumber0,
    );

    const nonLowestDocketNumberCase = result.find(
      record => record.docketNumber === docketNumber1,
    );

    expect(lowestDocketNumberCase.docketEntries[4].workItem).toBeDefined();
    expect(nonLowestDocketNumberCase.docketEntries[4].workItem).toBeUndefined();
  });

  it('should add a coversheet to each document', async () => {
    await fileExternalDocumentForConsolidatedInteractor(applicationContext, {
      docketNumbersForFiling: ['101-19', '102-19'],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        primaryDocumentId: docketEntryId0,
        secondaryDocument: {
          docketEntryId: docketEntryId1,
          documentTitle: 'Redacted',
          documentType: 'Redacted',
          eventCode: 'REDC',
          filedBy: 'Test Petitioner',
        },
      },
      leadDocketNumber: docketNumber0,
    });
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls
        .length,
    ).toBe(4);
  });

  it('should file multiple documents for each case if a secondary document is provided and add a cover sheet to each', async () => {
    expect(caseRecords[0].docketEntries.length).toEqual(4);
    expect(caseRecords[1].docketEntries.length).toEqual(4);

    const result = await fileExternalDocumentForConsolidatedInteractor(
      applicationContext,
      {
        docketNumbersForFiling: ['101-19', '102-19'],
        documentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          primaryDocumentId: docketEntryId0,
          secondaryDocument: {
            docketEntryId: docketEntryId1,
            documentTitle: 'Redacted',
            documentType: 'Redacted',
            eventCode: 'REDC',
            filedBy: 'Test Petitioner',
          },
        },
        leadDocketNumber: docketNumber0,
      },
    );

    expect(result[0].docketEntries.length).toEqual(6);
    expect(result[1].docketEntries.length).toEqual(6);
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls
        .length,
    ).toBe(4);
  });

  it('should file multiple documents for each case when supporting documents are provided', async () => {
    expect(caseRecords[0].docketEntries.length).toEqual(4);
    expect(caseRecords[1].docketEntries.length).toEqual(4);

    const result = await fileExternalDocumentForConsolidatedInteractor(
      applicationContext,
      {
        docketNumbersForFiling: ['101-19', '102-19'],
        documentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          primaryDocumentId: docketEntryId0,
          secondaryDocument: {
            docketEntryId: docketEntryId1,
            documentTitle: 'Redacted',
            documentType: 'Redacted',
            eventCode: 'REDC',
            filedBy: 'Test Petitioner',
          },
          secondarySupportingDocuments: [
            {
              docketEntryId: docketEntryId2,
              documentTitle: 'Redacted',
              documentType: 'Redacted',
              eventCode: 'REDC',
              filedBy: 'Test Petitioner',
            },
          ],
          supportingDocuments: [
            {
              docketEntryId: docketEntryId3,
              documentTitle: 'Redacted',
              documentType: 'Redacted',
              eventCode: 'REDC',
              filedBy: 'Test Petitioner',
            },
          ],
        },
        leadDocketNumber: docketNumber0,
      },
    );

    expect(result[0].docketEntries.length).toEqual(8);
    expect(result[1].docketEntries.length).toEqual(8);
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls
        .length,
    ).toBe(8);
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await fileExternalDocumentForConsolidatedInteractor(applicationContext, {
      docketNumbersForFiling: ['101-19', '102-19'],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        primaryDocumentId: docketEntryId0,
        secondaryDocument: {
          docketEntryId: docketEntryId1,
          documentTitle: 'Redacted',
          documentType: 'Redacted',
          eventCode: 'REDC',
          filedBy: 'Test Petitioner',
        },
      },
      leadDocketNumber: docketNumber0,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: 'Guy Fieri',
    });
    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls
        .length,
    ).toBe(4);
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    await fileExternalDocumentForConsolidatedInteractor(applicationContext, {
      docketNumbersForFiling: ['101-19', '102-19'],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        primaryDocumentId: docketEntryId0,
        secondaryDocument: {
          docketEntryId: docketEntryId1,
          documentTitle: 'Redacted',
          documentType: 'Redacted',
          eventCode: 'REDC',
          filedBy: 'Test Petitioner',
        },
      },
      leadDocketNumber: docketNumber0,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('should not send the service email if an error occurs while adding a coversheet', async () => {
    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockRejectedValueOnce(new Error('bad!'));

    await expect(
      fileExternalDocumentForConsolidatedInteractor(applicationContext, {
        docketNumbersForFiling: ['101-19', '102-19'],
        documentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          primaryDocumentId: docketEntryId0,
          secondaryDocument: {
            docketEntryId: docketEntryId1,
            documentTitle: 'Redacted',
            documentType: 'Redacted',
            eventCode: 'REDC',
            filedBy: 'Test Petitioner',
          },
        },
        leadDocketNumber: docketNumber0,
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toBeCalled();
  });
});
