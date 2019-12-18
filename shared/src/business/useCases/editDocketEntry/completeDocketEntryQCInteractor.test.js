const {
  completeDocketEntryQCInteractor,
} = require('./completeDocketEntryQCInteractor');
const { User } = require('../../entities/User');
import {
  createISODateString,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';

describe('completeDocketEntryQCInteractor', () => {
  let applicationContext;
  const workItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    document: {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    isQC: true,
    section: 'docket',
    sentBy: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    updatedAt: new Date().toISOString(),
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '45678-18',
    docketRecord: [
      {
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
        index: 42,
      },
    ],
    documents: [
      {
        documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
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
    role: User.ROLES.petitioner,
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
            role: User.ROLES.adc,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({}),
      };
      await completeDocketEntryQCInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('adds documents and workitems', async () => {
    let error;
    let getCaseByCaseIdSpy = jest.fn(() => caseRecord);
    let deleteWorkItemFromInboxSpy = jest.fn();
    let saveWorkItemForDocketClerkFilingExternalDocumentSpy = jest.fn();
    let updateCaseSpy = jest.fn();
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          deleteWorkItemFromInbox: deleteWorkItemFromInboxSpy,
          getCaseByCaseId: getCaseByCaseIdSpy,
          getUserById: async () => ({
            name: 'Olivia Jade',
            role: User.ROLES.docketClerk,
            section: 'docket',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
          saveWorkItemForDocketClerkFilingExternalDocument: saveWorkItemForDocketClerkFilingExternalDocumentSpy,
          updateCase: updateCaseSpy,
        }),
        getUtilities: () => {
          return {
            createISODateString,
            formatDateString,
          };
        },
      };
      await completeDocketEntryQCInteractor({
        applicationContext,
        entryMetadata: {
          caseId: caseRecord.caseId,
          documentId: 'fffba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForDocketClerkFilingExternalDocumentSpy).toBeCalled();
    expect(deleteWorkItemFromInboxSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
  });
});
