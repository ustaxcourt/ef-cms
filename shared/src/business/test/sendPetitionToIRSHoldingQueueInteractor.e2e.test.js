const sinon = require('sinon');
const {
  assignWorkItemsInteractor,
} = require('../useCases/workitems/assignWorkItemsInteractor');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  createWorkItemInteractor,
} = require('../useCases/workitems/createWorkItemInteractor');
const {
  getDocumentQCBatchedForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCBatchedForSectionInteractor');
const {
  getDocumentQCBatchedForUserInteractor,
} = require('../useCases/workitems/getDocumentQCBatchedForUserInteractor');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  getInboxMessagesForSectionInteractor,
} = require('../useCases/workitems/getInboxMessagesForSectionInteractor');
const {
  getInboxMessagesForUserInteractor,
} = require('../useCases/workitems/getInboxMessagesForUserInteractor');
const {
  sendPetitionToIRSHoldingQueueInteractor,
} = require('../useCases/sendPetitionToIRSHoldingQueueInteractor');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { User } = require('../entities/User');

const DATE = '2019-03-01T22:54:06.000Z';

describe('sendPetitionToIRSHoldingQueueInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
    applicationContext = createTestApplicationContext();
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should create the expected work items and update their status when a petition is sent to the irs holding queue', async () => {
    await createCaseInteractor({
      applicationContext,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      petitionMetadata: {
        caseType: 'CDP (Lien/Levy)',
        contactPrimary: {
          address1: '78 West Old Avenue',
          address2: 'Aut corrupti culpa',
          address3: 'Aut magna expedita f',
          city: 'Magna sit nemo magna',
          countryType: 'domestic',
          email: 'taxpayer@example.com',
          name: 'Adele Carver',
          phone: '+1 (349) 328-1083',
          postalCode: '28371',
          state: 'VA',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: 'Petitioner',
        preferredTrialCity: 'Charleston, West Virginia',
        procedureType: 'Regular',
      },
      stinFileId: '946bde5e-0d7f-4c58-8eff-d6eb8551cc8e',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: 'petitionsclerk',
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    // verify work item in petitions section inbox
    const petitionSectionInbox = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });

    expect(petitionSectionInbox).toMatchObject([
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        document: {
          documentId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
          documentType: 'Petition',
          filedBy: 'Adele Carver',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'richard',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
          },
        ],
        section: 'petitions',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const { workItemId } = petitionSectionInbox[0];
    const { caseId } = petitionSectionInbox[0];
    const { documentId } = petitionSectionInbox[0].document;

    await assignWorkItemsInteractor({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
      workItemId,
    });
    const petitionsUserInbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

    expect(petitionsUserInbox).toMatchObject([
      {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        caseStatus: 'New',
        isInitializeCase: true,
        messages: [
          {
            from: 'richard',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
            to: 'Test Petitionsclerk',
            toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'petitions',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        workItemId: workItemId,
      },
    ]);

    // create a new work item on petition for docketclerk
    await createWorkItemInteractor({
      applicationContext,
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      caseId,
      documentId,
      message: 'this is a new message for the docketclerk user',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'alex',
        role: 'docketclerk',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };
    const docketclerkUserInbox = await getInboxMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(docketclerkUserInbox).toMatchObject([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        isInitializeCase: false,
        messages: [
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'this is a new message for the docketclerk user',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const docketSectionInbox = await getInboxMessagesForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(docketSectionInbox).toMatchObject([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        document: {
          createdAt: '2019-03-01T22:54:06.000Z',
          documentId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
          documentType: 'Petition',
        },
        isInitializeCase: false,
        messages: [
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'this is a new message for the docketclerk user',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: 'petitionsclerk',
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    await sendPetitionToIRSHoldingQueueInteractor({
      applicationContext,
      caseId,
    });

    const petitionsclerkInboxAfterIRSHoldingQueue = await getDocumentQCInboxForUserInteractor(
      {
        applicationContext,
        userId: applicationContext.getCurrentUser().userId,
      },
    );

    expect(petitionsclerkInboxAfterIRSHoldingQueue).toEqual([]);

    const petitionSectionInboxAfterIRSHoldingQueue = await getDocumentQCInboxForSectionInteractor(
      {
        applicationContext,
        section: 'petitions',
      },
    );
    expect(petitionSectionInboxAfterIRSHoldingQueue).toEqual([]);

    const petitionsclerkOutboxAfterIRSHoldingQueue = await getDocumentQCBatchedForUserInteractor(
      {
        applicationContext,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );
    expect(petitionsclerkOutboxAfterIRSHoldingQueue).toMatchObject([
      {
        assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
        assigneeName: 'IRS Holding Queue',
        caseStatus: 'Batched for IRS',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        document: {
          documentType: 'Petition',
          filedBy: 'Adele Carver',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'richard',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
            to: 'Test Petitionsclerk',
            toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition batched for IRS',
            to: 'IRS Holding Queue',
            toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
          },
        ],
        section: 'irsBatchSection',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const petitionsSectionOutboxAfterIRSHoldingQueue = await getDocumentQCBatchedForSectionInteractor(
      {
        applicationContext,
        section: 'petitions',
      },
    );
    expect(petitionsSectionOutboxAfterIRSHoldingQueue).toMatchObject([
      {
        assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
        assigneeName: 'IRS Holding Queue',
        caseStatus: 'Batched for IRS',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        document: {
          documentType: 'Petition',
          filedBy: 'Adele Carver',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'richard',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Adele Carver is ready for review.',
            to: 'Test Petitionsclerk',
            toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition batched for IRS',
            to: 'IRS Holding Queue',
            toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
          },
        ],
        section: 'irsBatchSection',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: 'docketclerk',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };
    const docketClerkInboxAfterIRSQueue = await getInboxMessagesForUserInteractor(
      {
        applicationContext,
        userId: applicationContext.getCurrentUser().userId,
      },
    );

    expect(docketClerkInboxAfterIRSQueue).toMatchObject([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseStatus: 'Batched for IRS',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        document: {
          documentType: 'Petition',
        },
        isInitializeCase: false,
        messages: [
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'this is a new message for the docketclerk user',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const docketSectionInboxAfterIRSQueue = await getInboxMessagesForSectionInteractor(
      {
        applicationContext,
        section: 'docket',
      },
    );
    expect(docketSectionInboxAfterIRSQueue).toMatchObject([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseStatus: 'Batched for IRS',
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        document: {
          documentType: 'Petition',
        },
        isInitializeCase: false,
        messages: [
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'this is a new message for the docketclerk user',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
