const {
  fileExternalDocumentForConsolidatedInteractor,
} = require('./fileExternalDocumentForConsolidatedInteractor');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { User } = require('../../entities/User');

describe('fileExternalDocumentForConsolidatedInteractor', () => {
  let applicationContext;
  let caseRecords;
  let sendBulkTemplatedEmailMock;
  const caseId0 = '00000000-b37b-479d-9201-067ec6e335bb';
  const caseId1 = '11111111-b37b-479d-9201-067ec6e335bb';
  const documentId0 = 'd0d0d0d0-b37b-479d-9201-067ec6e335bb';
  const documentId1 = 'd1d1d1d1-b37b-479d-9201-067ec6e335bb';
  const documentId2 = 'd2d2d2d2-b37b-479d-9201-067ec6e335bb';
  const documentId3 = 'd3d3d3d3-b37b-479d-9201-067ec6e335bb';

  beforeEach(() => {
    sendBulkTemplatedEmailMock = jest.fn();

    caseRecords = [
      {
        caseId: caseId0,
        contactPrimary: {
          email: 'fieri@example.com',
          name: 'Guy Fieri',
        },
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: '123-19',
        docketRecord: [],
        documents: [],
        leadCaseId: caseId0,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      },
      {
        caseId: caseId1,
        contactPrimary: {
          email: 'ferrari@example.com',
          name: 'Enzo Ferrari',
        },
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: '234-19',
        docketRecord: [],
        documents: [],
        leadCaseId: caseId0,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      },
    ];

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Guy Fieri',
          role: User.ROLES.petitioner,
          userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getDispatchers: () => ({
        sendBulkTemplatedEmail: sendBulkTemplatedEmailMock,
      }),
      getPersistenceGateway: () => ({
        getCasesByLeadCaseId: async () => caseRecords,
        getUserById: () => ({
          name: 'Guy Fieri',
          role: User.ROLES.petitioner,
          userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
        }),
        saveWorkItemForNonPaper: async () => {},
        updateCase: async ({ caseToUpdate }) => await caseToUpdate,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
  });

  it('Should throw an error if not authorized', async () => {
    let error;

    applicationContext.getCurrentUser = () => {
      return {};
    };

    try {
      await fileExternalDocumentForConsolidatedInteractor({
        applicationContext,
        documentIds: ['dddddddd-1111-dddd-1111-dddddddddddd'],
        documentMetadata: {
          caseId: caseRecords.caseId,
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('Should associate the document with all cases in the consolidated set', async () => {
    expect(caseRecords[0].documents.length).toEqual(0);
    expect(caseRecords[1].documents.length).toEqual(0);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetadata: {
        documentType: 'Memorandum in Support',
      },
      leadCaseId: caseId0,
    });

    expect(result[0].documents[0].documentId).toEqual(documentId0);
    expect(result[1].documents[0].documentId).toEqual(documentId0);
  });

  it('Should generate a docket record entry on each case in the consolidated set', async () => {
    expect(caseRecords[0].docketRecord.length).toEqual(0);
    expect(caseRecords[1].docketRecord.length).toEqual(0);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetadata: {
        documentType: 'Memorandum in Support',
      },
      leadCaseId: caseId0,
    });

    expect(result[0].docketRecord[0].documentId).toEqual(documentId0);
    expect(result[1].docketRecord[0].documentId).toEqual(documentId0);
  });

  it.skip('Should aggregate the filing parties for the docket record entry', async () => {
    // skipping until we finalize how this will be handled
    await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetadata: {
        documentType: 'Memorandum in Support',
      },
      filingPartyNames: ['Guy Fieri', 'Enzo Ferrari'],
      leadCaseId: caseId0,
    });
  });

  it('Should generate only ONE QC work item for the filing, to be found on the lead case document', async () => {
    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetadata: {
        documentType: 'Memorandum in Support',
      },
      leadCaseId: caseId0,
    });

    const leadCase = result.find(record => record.caseId === caseId0);
    const nonLeadCase = result.find(record => record.caseId === caseId1);

    expect(leadCase.documents[0].workItems.length).toEqual(1);
    expect(nonLeadCase.documents[0].workItems.length).toEqual(0);
  });

  it('Should file multiple documents for each case if a secondary document is provided', async () => {
    expect(caseRecords[0].documents.length).toEqual(0);
    expect(caseRecords[1].documents.length).toEqual(0);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0, documentId1],
      documentMetadata: {
        documentType: 'Memorandum in Support',
        secondaryDocument: {
          documentType: 'Redacted',
        },
      },
      leadCaseId: caseId0,
    });

    expect(result[0].documents.length).toEqual(2);
    expect(result[1].documents.length).toEqual(2);
  });

  it('Should file multiple documents for each case if a supporting documents are provided', async () => {
    expect(caseRecords[0].documents.length).toEqual(0);
    expect(caseRecords[1].documents.length).toEqual(0);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0, documentId1, documentId2, documentId3],
      documentMetadata: {
        documentType: 'Memorandum in Support',
        secondaryDocument: {
          documentType: 'Redacted',
        },
        secondarySupportingDocuments: [
          {
            documentType: 'Redacted',
          },
        ],
        supportingDocuments: [
          {
            documentType: 'Redacted',
          },
        ],
      },
      leadCaseId: caseId0,
    });

    expect(result[0].documents.length).toEqual(4);
    expect(result[1].documents.length).toEqual(4);
  });

  // service on parties?
});
