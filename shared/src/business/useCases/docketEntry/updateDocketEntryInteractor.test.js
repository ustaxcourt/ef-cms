const sinon = require('sinon');
const {
  updateDocketEntryInteractor,
} = require('./updateDocketEntryInteractor');
const { User } = require('../../entities/User');

describe('updateDocketEntryInteractor', () => {
  let applicationContext;

  const workItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    document: {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    section: 'docket',
    sentBy: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    updatedAt: new Date().toISOString(),
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b1',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
    ],
    role: 'petitioner',
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };
  it('should throw an error if not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: 'seniorattorney',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: async () => caseRecord,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: 'seniorattorney',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForNonPaper: async () => caseRecord,
          updateCase: async () => caseRecord,
        }),
      };
      await updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('updates the workitem without updating the document if no file is attached', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let deleteWorkItemFromInboxSpy = sinon.spy();
    let saveWorkItemForDocketClerkFilingExternalDocumentSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: 'docketclerk',
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          deleteWorkItemFromInbox: deleteWorkItemFromInboxSpy,
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: 'docketclerk',
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
          updateCase: updateCaseSpy,
        }),
      };
      await updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          isFileAttached: false,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy.called).toEqual(
      false,
    );
    expect(deleteWorkItemFromInboxSpy.called).toEqual(false);
    expect(updateCaseSpy.called).toEqual(true);
  });

  it('adds documents and workitems', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let deleteWorkItemFromInboxSpy = sinon.spy();
    let saveWorkItemForDocketClerkFilingExternalDocumentSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: 'docketclerk',
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          deleteWorkItemFromInbox: deleteWorkItemFromInboxSpy,
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: 'docketclerk',
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
          updateCase: updateCaseSpy,
        }),
      };
      await updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          isFileAttached: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy.called).toEqual(
      true,
    );
    expect(deleteWorkItemFromInboxSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
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
            role: 'docketclerk',
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: 'docketclerk',
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
          saveWorkItemForDocketEntryWithoutFile: saveWorkItemForDocketEntryWithoutFileSpy,
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,

          updateCase: updateCaseSpy,
        }),
      };
      await updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
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
});
