const sinon = require('sinon');
const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');

describe('fileExternalDocumentInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    contactPrimary: {
      name: 'Guy Fieri',
    },
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
    partyType: ContactFactory.PARTY_TYPES.petitioner,
    role: 'petitioner',
    userId: 'taxpayer',
  };
  it('should throw an error if not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Seniorattorney',
            role: 'seniorattorney',
            userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: async () => caseRecord,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          saveWorkItemForNonPaper: async () => caseRecord,
          updateCase: async () => caseRecord,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
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
          return new User({
            name: 'Respondent',
            role: 'respondent',
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          });
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(saveWorkItemForNonPaperSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
  });

  it('add documents but not workitems for paper filed documents', async () => {
    let error;
    let getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    let saveWorkItemForNonPaperSpy = sinon.spy();
    let saveWorkItemForDocketClerkFilingExternalDocumentSpy = sinon.spy();
    let updateCaseSpy = sinon.spy();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Docketclerk',
            role: 'docketclerk',
            userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
          };
        },
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          isPaper: true,
        },
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
