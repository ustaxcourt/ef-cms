const sinon = require('sinon');
const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('fileExternalDocumentInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    contactPrimary: {
      email: 'fieri@example.com',
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
            name: 'adc',
            role: User.ROLES.adc,
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

  it('add documents and workitems and serve the documents on the parties with an electronic service indicator', async () => {
    let error;
    const getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    const saveWorkItemForNonPaperSpy = sinon.spy();
    const updateCaseSpy = sinon.spy();
    const sendBulkTemplatedEmailMock = jest.fn();

    let updatedCase;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Respondent',
            role: User.ROLES.respondent,
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          });
        },
        getDispatchers: () => ({
          sendBulkTemplatedEmail: sendBulkTemplatedEmailMock,
        }),
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
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
    expect(sendBulkTemplatedEmailMock).toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toEqual('served');
    expect(updatedCase.documents[3].servedAt).toBeDefined();
  });

  it('add documents and workitems but do not auto-serve Simultaneous documents on the parties', async () => {
    let error;
    const getCaseByCaseIdSpy = sinon.stub().returns(caseRecord);
    const saveWorkItemForNonPaperSpy = sinon.spy();
    const updateCaseSpy = sinon.spy();
    const sendBulkTemplatedEmailMock = jest.fn();

    let updatedCase;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Respondent',
            role: User.ROLES.respondent,
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          });
        },
        getDispatchers: () => ({
          sendBulkTemplatedEmail: sendBulkTemplatedEmailMock,
        }),
        getPersistenceGateway: () => ({
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
          updateCase: updateCaseSpy,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      };
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Amended Simultaneous Memoranda of Law',
          documentType: 'Amended Simultaneous Memoranda of Law',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy.called).toEqual(true);
    expect(saveWorkItemForNonPaperSpy.called).toEqual(true);
    expect(updateCaseSpy.called).toEqual(true);
    expect(sendBulkTemplatedEmailMock).not.toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toBeUndefined();
    expect(updatedCase.documents[3].servedAt).toBeUndefined();
  });
});
