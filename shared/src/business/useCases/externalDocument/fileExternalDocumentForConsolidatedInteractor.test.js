const {
  fileExternalDocumentForConsolidatedInteractor,
} = require('./fileExternalDocumentForConsolidatedInteractor');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('fileExternalDocumentForConsolidatedInteractor', () => {
  let applicationContext;
  let caseRecords;
  const caseId0 = '00000000-0000-0000-0000-000000000000';
  const caseId1 = '11111111-1111-1111-1111-111111111111';
  const documentId0 = 'dddddddd-0000-dddd-0000-dddddddddddd';
  // const documentId1 = 'dddddddd-1111-dddd-1111-dddddddddddd';

  beforeEach(() => {
    caseRecords = [
      {
        caseId: caseId0,
        contactPrimary: {
          email: 'fieri@example.com',
          name: 'Guy Fieri',
        },
        createdAt: '',
        docketNumber: '000-00',
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
        createdAt: '',
        docketNumber: '111-00',
        docketRecord: [],
        documents: [],
        leadCaseId: caseId0,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      },
    ];
  });

  it('Should throw an error if not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'adc',
            role: User.ROLES.adc,
            userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
          };
        },
        getPersistenceGateway: () => ({
          getCasesByLeadCaseId: async () => caseRecords,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          //saveWorkItemForNonPaper: async () => caseRecord,
          //updateCase: async () => caseRecord,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
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

    await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetaData: {
        documentType: 'Memorandum in Support',
        leadCaseId: caseId0,
      },
    });

    expect(caseRecords[0].documents[0].documentId).toEqual(documentId0);
    expect(caseRecords[1].documents[0].documentId).toEqual(documentId0);
  });

  it('Should generate a docket record entry on each case in the consolidated set', async () => {
    expect(caseRecords[0].docketRecord.length).toEqual(0);
    expect(caseRecords[1].docketRecord.length).toEqual(0);

    await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetaData: {
        documentType: 'Memorandum in Support',
        leadCaseId: caseId0,
      },
    });

    expect(caseRecords[0].docketRecord[0].documentId).toEqual(documentId0);
    expect(caseRecords[1].docketRecord[0].documentId).toEqual(documentId0);
  });

  it.skip('Should aggregate the filing parties for the docket record entry', async () => {
    // skipping until we finalize how this will be handled
    await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetaData: {
        documentType: 'Memorandum in Support',
        filingPartyNames: ['Guy Fieri', 'Enzo Ferrari'],
        leadCaseId: caseId0,
      },
    });
  });

  it('Should generate only ONE QC work item for the filing, to be found on the lead case document', async () => {
    const leadCase = caseRecords.find(record => record.caseId === caseId0);
    const nonLeadCase = caseRecords.find(record => record.caseId === caseId1);

    await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetaData: {
        documentType: 'Memorandum in Support',
        leadCaseId: caseId0,
      },
    });

    expect(leadCase.documents[0].workItems.length).toEqual(1);
    expect(nonLeadCase.documents[0].workItems.length).toEqual(0);
  });
});
