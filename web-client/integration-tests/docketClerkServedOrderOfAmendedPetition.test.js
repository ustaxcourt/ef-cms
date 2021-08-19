import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition } from './journey/docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('Docket Clerk serves a Order of Amended Petition', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  cerebralTest.draftOrders = [];

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition(
    cerebralTest,
    0,
  );

  docketClerkViewsCaseDetail(cerebralTest);

  it('verify the docket entries title is set correctly', () => {
    const servedEntry = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(
        d => d.docketEntryId === cerebralTest.docketRecordEntry.docketEntryId,
      );
    expect(servedEntry.documentTitle).toEqual(
      'Order for Amended Petition on 02-02-2050',
    );
  });
});
