import {
  ADVANCED_SEARCH_TABS,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  embedWithLegalIpsumText,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { updateACaseType } from './journey/updateACaseType';

describe('order search journey for docket number', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];
  cerebralTest.createdCases = [];

  beforeEach(() => {
    global.window ??= Object.create({
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    });
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('Creates the first case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'welcome to flavortown',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
    });

    expect(caseDetail.docketNumberWithSuffix).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumberWithSuffix;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('magic'),
    documentTitle: 'some title',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);
  updateACaseType(cerebralTest, CASE_TYPES_MAP.whistleblower);

  it('Creates the second case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      caseType: CASE_TYPES_MAP.whistleblower,
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Guy Fieri',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
    });

    expect(caseDetail.docketNumberWithSuffix).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumberWithSuffix;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('some content'),
    documentTitle: 'some other title',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
  docketClerkServesDocument(cerebralTest, 1);
  updateACaseType(cerebralTest, CASE_TYPES_MAP.cdp);

  it('Creates the third case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      caseType: CASE_TYPES_MAP.whistleblower,
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Guy Fieri',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
    });

    expect(caseDetail.docketNumberWithSuffix).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumberWithSuffix;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('magic'),
    documentTitle: 'some other title',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  docketClerkServesDocument(cerebralTest, 2);
  updateACaseType(cerebralTest, CASE_TYPES_MAP.cdp);

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('searches for an order by keyword for first created docket number', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: `"${cerebralTest.createdCases[0]}"`,
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
          docketNumberWithSuffix: cerebralTest.createdCases[0],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          docketNumberWithSuffix: cerebralTest.createdCases[1],
        }),
      ]),
    );
  });

  it('searches for an order by keyword for second created docket number', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: `"${cerebralTest.createdCases[1]}"`,
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          docketNumberWithSuffix: cerebralTest.createdCases[1],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
          docketNumberWithSuffix: cerebralTest.createdCases[0],
        }),
      ]),
    );
  });

  it('searches for an order by keyword for documentContent and new docket number', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        docketNumber: `${cerebralTest.createdCases[2]}`,
        keyword: 'magic',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumberWithSuffix: cerebralTest.createdCases[2],
        }),
      ]),
    );
  });
});
