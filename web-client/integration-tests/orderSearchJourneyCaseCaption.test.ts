import {
  ADVANCED_SEARCH_TABS,
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
import { updateACaseCaption } from './journey/updateACaseCaption';

describe('order search journey for case caption', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];
  cerebralTest.createdCases = [];

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

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
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
  updateACaseCaption(cerebralTest, 'Guy Fieri');

  it('Creates the second case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
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
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
  docketClerkServesDocument(cerebralTest, 1);
  updateACaseCaption(cerebralTest, 'welcome to flavortown');

  it('Creates the third case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
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

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('Welcome to flavortown magic'),
    documentTitle: 'some other title',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  docketClerkServesDocument(cerebralTest, 2);
  updateACaseCaption(cerebralTest, 'Johnny Boy');

  it('Creates the fourth case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'flavortown',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
    });

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
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
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 3);
  docketClerkServesDocument(cerebralTest, 3);
  updateACaseCaption(cerebralTest, 'Guy Fieri');

  it('Creates the fifth case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'flavortown',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
    });

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
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
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 4);
  docketClerkServesDocument(cerebralTest, 4);
  updateACaseCaption(cerebralTest, 'Sam Fieri');

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('searches for an order by keyword `"welcome to flavortown"`', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"welcome to flavortown"',
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
          docketNumber: cerebralTest.createdCases[0],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          docketNumber: cerebralTest.createdCases[1],
        }),
      ]),
    );
  });

  it('searches for an order by keyword `"Guy Fieri"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: '"Guy Fieri"',
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
          docketNumber: cerebralTest.createdCases[1],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
          docketNumber: cerebralTest.createdCases[0],
        }),
      ]),
    );
  });

  it('searches for an order by keyword `"magic"` and case caption `"welcome to flavortown"`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: '"welcome to flavortown"',
        keyword: '"magic"',
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
          docketNumber: cerebralTest.createdCases[1],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
          docketNumber: cerebralTest.createdCases[0],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
      ]),
    );
  });

  it('searches for an order by keyword `welcome to flavortown`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'welcome to flavortown',
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
          docketNumber: cerebralTest.createdCases[0],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          docketNumber: cerebralTest.createdCases[1],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
          docketNumber: cerebralTest.createdCases[3],
        }),
      ]),
    );
  });

  it('searches for an order by keyword `Guy Fieri`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Guy Fieri',
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
          docketNumber: cerebralTest.createdCases[1],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
          docketNumber: cerebralTest.createdCases[0],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
          docketNumber: cerebralTest.createdCases[3],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[4].docketEntryId,
          docketNumber: cerebralTest.createdCases[4],
        }),
      ]),
    );
  });

  it('searches for "Welcome to flavortown" inside the case title and a non-real keyword `whatever`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: 'Welcome to flavortown',
        keyword: 'whatever',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    const searchResults = cerebralTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults.length).toEqual(0);
  });

  it('searches for "magic" and case title of `Guy Fieri`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: 'Guy Fieri',
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
          docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
          docketNumber: cerebralTest.createdCases[0],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
          docketNumber: cerebralTest.createdCases[3],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          docketNumber: cerebralTest.createdCases[1],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[4].docketEntryId,
          docketNumber: cerebralTest.createdCases[4],
        }),
      ]),
    );
  });

  it('searches for "welcome to flavortown" and case title of `Guy Fieri`', async () => {
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: 'Guy Fieri',
        keyword: 'welcome to flavortown',
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
          docketNumber: cerebralTest.createdCases[0],
        }),
      ]),
    );

    expect(searchResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[1].docketEntryId,
          docketNumber: cerebralTest.createdCases[1],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[2].docketEntryId,
          docketNumber: cerebralTest.createdCases[2],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
          docketNumber: cerebralTest.createdCases[3],
        }),
        expect.objectContaining({
          docketEntryId: cerebralTest.draftOrders[4].docketEntryId,
          docketNumber: cerebralTest.createdCases[4],
        }),
      ]),
    );
  });
});
