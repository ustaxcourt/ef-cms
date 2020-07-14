import { loginAs, setupTest, uploadPetition } from './helpers';

const DOCKET_CLERK_1_ID = '2805d1ab-18d0-43ec-bafb-654e83405416';
const MESSAGE = 'new test message';

/**
 * creates a new work item for the given test
 *
 * @param {object} test the current test object
 * @returns {void} runs createWorkItemSequence
 */
async function createWorkItem(test) {
  test.setState('form', {
    assigneeId: DOCKET_CLERK_1_ID,
    message: MESSAGE,
    section: 'docket',
  });

  return await test.runSequence('createWorkItemSequence');
}

/**
 * finds a workItem in the given queue based on the given getDocketNumber and message
 *
 * @param {object} providers the providers object
 * @param {string} providers.box the work queue box
 * @param {string} providers.docketNumber the docketNumber to search for
 * @param {string} providers.message the message to search for
 * @param {string} providers.queue the work queue name (my || section)
 * @param {object} providers.test the current test object
 * @param {boolean} providers.workQueueIsInternal whether the work queue to be searched is the messages queue
 * @returns {object} workItem
 */
async function findWorkItemInWorkQueue({
  box,
  docketNumber,
  message,
  queue,
  test,
  workQueueIsInternal = true,
}) {
  await test.runSequence('chooseWorkQueueSequence', {
    box,
    queue,
    workQueueIsInternal,
  });

  const workQueue = test.getState('workQueue');

  const workItem = workQueue.find(
    i => i.docketNumber === docketNumber && i.messages[0].message === message,
  );

  return workItem;
}

const test = setupTest();

describe('Create a work item', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  let docketNumber;
  let petitionDocument;

  loginAs(test, 'petitioner@example.com');

  it('create the case for this test', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    ({ docketNumber } = caseDetail);
    petitionDocument = caseDetail.documents.find(
      d => d.documentType === 'Petition',
    );
  });

  loginAs(test, 'petitionsclerk@example.com');

  it('login as a petitionsclerk and create a new work item on the petition document', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: docketNumber,
      documentId: petitionDocument.documentId,
    });

    await createWorkItem(test);
  });

  it('verify the work item exists on the petitions user my outbox', async () => {
    const workItemFromMyOutbox = await findWorkItemInWorkQueue({
      box: 'outbox',
      docketNumber,
      message: MESSAGE,
      queue: 'my',
      test,
    });
    expect(workItemFromMyOutbox).toBeDefined();
  });

  it('verify the work item exists on the petitions section outbox', async () => {
    const workItemFromSectionOutbox = await findWorkItemInWorkQueue({
      box: 'outbox',
      docketNumber,
      message: MESSAGE,
      queue: 'section',
      test,
    });
    expect(workItemFromSectionOutbox).toBeDefined();
  });

  loginAs(test, 'docketclerk1@example.com');

  it('verify the work item exists on the docket section inbox', async () => {
    const workItemFromSectionInbox = await findWorkItemInWorkQueue({
      box: 'inbox',
      docketNumber,
      message: MESSAGE,
      queue: 'section',
      test,
    });

    expect(workItemFromSectionInbox).toBeDefined();
  });

  it('verify the work item exists on the docketclerk1 user my inbox', async () => {
    const workItemFromMyInbox = await findWorkItemInWorkQueue({
      box: 'inbox',
      docketNumber,
      message: MESSAGE,
      queue: 'my',
      test,
    });
    expect(workItemFromMyInbox).toBeDefined();
  });
});
