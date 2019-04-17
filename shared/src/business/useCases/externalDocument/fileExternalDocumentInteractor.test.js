const sinon = require('sinon');
const { fileExternalDocument } = require('./fileExternalDocumentInteractor');

describe('fileExternalDocument', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
    ],
    role: 'petitioner',
    userId: 'taxpayer',
  };
  it('should throw if not authorized', async () => {
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
          saveWorkItemForNonPaper: async () => caseRecord,
          updateCase: async () => caseRecord,
        }),
        getUseCases: () => ({
          createDocument: () => null,
        }),
      };
      await fileExternalDocument({
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

  it('add documents and workitems', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let saveWorkItemForNonPaperSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: 'respondent',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUseCases: () => ({
          createDocument: () => null,
        }),
      };
      await fileExternalDocument({
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
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(saveWorkItemForNonPaperSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });
});
