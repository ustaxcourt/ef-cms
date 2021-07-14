import { associatedUserSearchesForServedOrder } from './journey/associatedUserSearchesForServedOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserSearchesForServedOrderInSealedCase } from './journey/unassociatedUserSearchesForServedOrderInSealedCase';
import { unassociatedUserSearchesForServedOrderInUnsealedCase } from './journey/unassociatedUserSearchesForServedOrderInUnsealedCase';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('external users perform an advanced search for orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case #1', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'this is a thing that I can search for, Jiminy Cricket',
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInUnsealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedUserSearchesForServedOrder(
    cerebralTest,
    {
      draftOrderIndex: 0,
      keyword: 'Jiminy Cricket',
    },
    true,
  );

  loginAs(cerebralTest, 'privatePractitioner1@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  associatedUserSearchesForServedOrder(
    cerebralTest,
    {
      draftOrderIndex: 0,
      keyword: 'Jiminy Cricket',
    },
    true,
  );

  loginAs(cerebralTest, 'irsPractitioner2@example.com');
  unassociatedUserSearchesForServedOrderInSealedCase(cerebralTest, {
    draftOrderIndex: 0,
    keyword: 'Jiminy Cricket',
  });
});
