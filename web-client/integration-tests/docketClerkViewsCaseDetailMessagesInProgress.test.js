import {
  createMessage,
  loginAs,
  setupTest,
  uploadPetition,
  viewDocumentDetailMessage,
} from './helpers';
import { extractedPendingMessagesFromCaseDetail as extractedPendingMessagesFromCaseDetailComputed } from '../src/presenter/computeds/extractPendingMessagesFromCaseDetail';
import { petitionsClerkCreateOrder } from './journey/petitionsClerkCreateOrder';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractedPendingMessagesFromCaseDetailComputed,
);

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('a docket clerk views case detail messages in progress with a message on a draft order', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreateOrder(test);
  it('petitions clerk sends message to docket clerk on draft order', async () => {
    await viewDocumentDetailMessage({
      docketNumber: test.docketNumber,
      documentId: test.documentId,
      test,
    });
    await createMessage({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk user id
      message: 'this is a test message for docket clerk',
      test,
    });
  });

  loginAs(test, 'docketclerk');
  it('docket clerk views case detail in progress messages with a message about a draft order', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    let result = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: test.getState(),
    });
    expect(result[0].editLink).not.toContain('/edit');
    expect(result[0].editLink).toContain('/messages/');
  });
});
