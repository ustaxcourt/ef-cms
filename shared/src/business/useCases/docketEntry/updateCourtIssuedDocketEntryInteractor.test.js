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
      caseCaption: 'Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
      contactPrimary: {
        name: 'Guy Fieri',
      },
      createdAt: '',
      docketNumber: '45678-18',
      docketRecord: [
        {
          description: 'first record',
          documentId: '8675309b-18d0-43ec-bafb-654e83405411',
          eventCode: 'P',
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
        },
      ],
      documents: [
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
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
        {
          docketNumber: '45678-18',
          documentId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'TRAN - Transcript',
          eventCode: 'TRAN',
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
      filingType: 'Myself',
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
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

  it('should set secondaryDate on the created document if the eventCode is TRAN', async () => {
    applicationContext.getCurrentUser = () => ({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        date: '2019-03-01T21:40:46.415Z',
        documentId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'TRAN - Transcript',
        eventCode: 'TRAN',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
      },
    });

    expect(updateCaseMock).toHaveBeenCalled();
    expect(
      updateCaseMock.mock.calls[0][0].caseToUpdate.documents[4],
    ).toMatchObject({
      secondaryDate: '2019-03-01T21:40:46.415Z',
    });
  });
});
