import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition } from './journey/docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('Docket Clerk serves a Order of Amended Petition', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  test.draftOrders = [];

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
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
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 0);
  docketClerkSignsOrder(test, 0);
  docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition(test, 0);

  docketClerkViewsCaseDetail(test);

  it('verify the docket entries title is set correctly', () => {
    const servedEntry = test
      .getState('caseDetail.docketEntries')
      .find(d => d.docketEntryId === test.docketRecordEntry.docketEntryId);
    expect(servedEntry.documentTitle).toEqual(
      'Order for Amended Petition on 02-02-2050',
    );
  });
});
