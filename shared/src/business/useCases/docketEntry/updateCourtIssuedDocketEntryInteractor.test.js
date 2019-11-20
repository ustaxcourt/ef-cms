import { updateCourtIssuedDocketEntryInteractor } from './updateCourtIssuedDocketEntryInteractor';
const { Case } = require('../../entities/cases/Case');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { User } = require('../../entities/User');

describe('updateCourtIssuedDocketEntryInteractor', () => {
  let updateCaseMock;
  let createUserInboxRecordMock;
  let createSectionInboxRecordMock;
  let applicationContext;
  let caseRecord;

  beforeEach(() => {
    updateCaseMock = jest.fn(() => caseRecord);
    createUserInboxRecordMock = jest.fn();
    createSectionInboxRecordMock = jest.fn();

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        createSectionInboxRecord: createSectionInboxRecordMock,
        createUserInboxRecord: createUserInboxRecordMock,
        getCaseByCaseId: async () => caseRecord,
        getUserById: async () => {
          return applicationContext.getCurrentUser();
        },
        updateCase: updateCaseMock,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    caseRecord = {
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
        {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          documentType: 'Order',
          userId: 'respondent',
          workItems: [
            {
              assigneeId: 'bob',
              assigneeName: 'bob',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseStatus: Case.STATUS_TYPES.new,
              caseTitle: 'testing',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {},
              isQC: true,
              messages: [],
              section: 'docket',
              sentBy: 'bob',
            },
          ],
        },
      ],
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
  });

  it('should throw an error if not authorized', async () => {
    let error;
    try {
      await updateCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          caseId: caseRecord.caseId,
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    let error;
    applicationContext.getCurrentUser = () => ({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    try {
      await updateCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          caseId: caseRecord.caseId,
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Order',
        },
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('Document not found');
  });

  it('should call updateCase, createUserInboxRecord, and createSectionInboxRecord', async () => {
    applicationContext.getCurrentUser = () => ({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        documentType: 'Order',
      },
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(createUserInboxRecordMock).toHaveBeenCalled();
    expect(createSectionInboxRecordMock).toHaveBeenCalled();
  });
});
