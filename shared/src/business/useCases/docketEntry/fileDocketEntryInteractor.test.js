const sinon = require('sinon');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { fileDocketEntryInteractor } = require('./fileDocketEntryInteractor');
const { User } = require('../../entities/User');

describe('fileDocketEntryInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    contactPrimary: {
      name: 'Guy Fieri',
    },
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        userId: 'respondent',
      },
    ],
    partyType: ContactFactory.PARTY_TYPES.petitioner,
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  };
  it('should throw an error if not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: async () => caseRecord,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: User.ROLES.adc,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForNonPaper: async () => caseRecord,
          updateCase: async () => caseRecord,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      await fileDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISL',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('add documents but not workitems for paper filed documents', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let saveWorkItemForNonPaperSpy = sinon.spy();
    let saveWorkItemForDocketClerkFilingExternalDocumentSpy = sinon.spy();
    let saveWorkItemForDocketEntryWithoutFileSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
          saveWorkItemForDocketEntryWithoutFile: saveWorkItemForDocketEntryWithoutFileSpy,
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,

          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      await fileDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISL',
          isPaper: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(saveWorkItemForNonPaperSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(true);
  });

  it('sets the eventCode to MISL when the document is lodged', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let saveWorkItemForNonPaperSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    let caseEntity = null;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      caseEntity = await fileDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          lodged: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(caseEntity.documents[3].eventCode).toEqual('MISL');
  });

  it('sets the eventCode to MISL on any secondaryDocument', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let saveWorkItemForNonPaperSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    let caseEntity = null;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      caseEntity = await fileDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISL',
          lodged: true,
          secondaryDocument: {
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'MISL',
          },
          secondarySupportingDocumentMetadata: {
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'MISL',
          },
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        secondaryDocumentFileId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
        secondarySupportingDocumentFileId:
          'e54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(caseEntity.documents[4].eventCode).toEqual('MISL');
    expect(caseEntity.documents[4].lodged).toEqual(true);
    expect(caseEntity.documents[5].eventCode).toEqual('MISL');
    expect(caseEntity.documents[5].lodged).toEqual(true);
  });
});
