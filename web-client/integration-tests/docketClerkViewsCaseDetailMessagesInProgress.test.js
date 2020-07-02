import {
  createMessage,
  loginAs,
  setupTest,
  uploadPetition,
  viewDocumentDetailMessage,
} from './helpers';
import { petitionsClerkCreateOrder } from './journey/petitionsClerkCreateOrder';

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
    expect(caseDetail.docketNumber).toBeDefined();
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
});
