const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { Case } = require('../../entities/cases/Case');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('fileExternalDocumentInteractor', () => {
  let globalUser;

  let caseRecord;
  let applicationContext;
  let getCaseByCaseIdSpy;
  const saveWorkItemForNonPaperSpy = jest.fn();
  const updateCaseSpy = jest.fn();
  const sendServedPartiesEmailsSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    caseRecord = {
      caseCaption: 'Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
      contactPrimary: {
        email: 'fieri@example.com',
        name: 'Guy Fieri',
      },
      createdAt: '',
      docketNumber: '45678-18',
      docketRecord: [
        {
          description: 'first record',
          docketNumber: '45678-18',
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
          eventCode: 'A',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'respondent',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'respondent',
        },
      ],
      filingType: 'Myself',
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: User.ROLES.petitioner,
      trialDate: '2019-03-01T21:40:46.415Z',
      userId: 'petitioner',
    };

    globalUser = new User({
      name: 'Respondent',
      role: User.ROLES.respondent,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    getCaseByCaseIdSpy = jest.fn().mockReturnValue(caseRecord);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => globalUser,
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdSpy,
        getUserById: ({ userId }) => MOCK_USERS[userId],
        saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
        updateCase: updateCaseSpy,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      getUseCaseHelpers: () => ({
        sendServedPartiesEmails: sendServedPartiesEmailsSpy,
      }),
    };
  });

  it('should throw an error if not authorized', async () => {
    globalUser = {
      name: 'adc',
      role: User.ROLES.adc,
      userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
    };

    let error;
    try {
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

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    let error;

    let updatedCase;
    try {
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          docketNumber: '45678-18',
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'A',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForNonPaperSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(sendServedPartiesEmailsSpy).toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toEqual('served');
    expect(updatedCase.documents[3].servedAt).toBeDefined();
  });

  it('should add documents and workitems but NOT auto-serve Simultaneous documents on the parties', async () => {
    let error;

    let updatedCase;
    try {
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          docketNumber: '45678-18',
          documentTitle: 'Amended Simultaneous Memoranda of Law',
          documentType: 'Amended Simultaneous Memoranda of Law',
          eventCode: 'A',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForNonPaperSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(sendServedPartiesEmailsSpy).not.toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toBeUndefined();
    expect(updatedCase.documents[3].servedAt).toBeUndefined();
  });

  it('should create a high-priority work item if the case status is calendared', async () => {
    caseRecord.status = Case.STATUS_TYPES.calendared;

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Amended Simultaneous Memoranda of Law',
        documentType: 'Amended Simultaneous Memoranda of Law',
        eventCode: 'A',
      },
    });

    expect(saveWorkItemForNonPaperSpy).toBeCalled();
    expect(saveWorkItemForNonPaperSpy.mock.calls[0][0]).toMatchObject({
      workItem: { highPriority: true, trialDate: '2019-03-01T21:40:46.415Z' },
    });
  });

  it('should create a not-high-priority work item if the case status is not calendared', async () => {
    caseRecord.status = Case.STATUS_TYPES.new;
    let error;

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Amended Simultaneous Memoranda of Law',
        documentType: 'Amended Simultaneous Memoranda of Law',
        eventCode: 'A',
      },
    });

    expect(error).toBeUndefined();
    expect(saveWorkItemForNonPaperSpy).toBeCalled();
    expect(saveWorkItemForNonPaperSpy.mock.calls[0][0]).toMatchObject({
      workItem: { highPriority: false },
    });
  });
});
