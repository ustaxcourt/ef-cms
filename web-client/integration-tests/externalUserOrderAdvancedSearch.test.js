import { associatedUserSearchesForServedOrder } from './journey/associatedUserSearchesForServedOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
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

const test = setupTest();
test.draftOrders = [];

describe('external users perform an advanced search for orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test, true);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentContents: 'this is a thing that I can search for, Jiminy Cricket',
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);
  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkSealsCase(test);
  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(test, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(test, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(test, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });
});
