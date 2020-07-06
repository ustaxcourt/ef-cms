import { associatedUserSearchesForServedOrder } from './journey/associatedUserSearchesForServedOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserSearchesForServedOrderInSealedCase } from './journey/unassociatedUserSearchesForServedOrderInSealedCase';
import { unassociatedUserSearchesForServedOrderInUnsealedCase } from './journey/unassociatedUserSearchesForServedOrderInUnsealedCase';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('external users perform an advanced search for orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });

  loginAs(test, 'petitioner');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnOrder(test, {
    documentContents: 'this is a thing that I can search for, Jiminy Cricket',
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkSignsOrder(test, 0);
  docketClerkServesDocument(test, 0);
  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'privatePractitioner');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'privatePractitioner1');
  unassociatedUserSearchesForServedOrderInUnsealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner2');
  unassociatedUserSearchesForServedOrderInUnsealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'docketclerk');
  docketClerkSealsCase(test);
  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'privatePractitioner');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'privatePractitioner1');
  unassociatedUserSearchesForServedOrderInSealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner2');
  unassociatedUserSearchesForServedOrderInSealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });
});
