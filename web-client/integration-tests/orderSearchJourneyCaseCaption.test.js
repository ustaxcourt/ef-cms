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

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('order search journey for case caption', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  cerebralTest.createdCases = [];

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
  docketClerkSignsOrder(cerebralTest, 0);
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
  docketClerkSignsOrder(cerebralTest, 1);
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
  docketClerkSignsOrder(cerebralTest, 2);
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
  docketClerkSignsOrder(cerebralTest, 2);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  docketClerkServesDocument(cerebralTest, 2);
  updateACaseCaption(cerebralTest, 'Guy Fieri');

  // docketClerkCreatesAnOrder(cerebralTest, {
  //   documentContents: embedWithLegalIpsumText('welcome to flavortown'),
  //   documentTitle: 'hold on',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkSignsOrder(cerebralTest, 1);
  // docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
  // docketClerkServesDocument(cerebralTest, 1);

  // docketClerkCreatesAnOrder(cerebralTest, {
  //   documentContents: embedWithLegalIpsumText('wait till the partys over'),
  //   documentTitle: 'welcome to flavortown',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkSignsOrder(cerebralTest, 2);
  // docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  // docketClerkServesDocument(cerebralTest, 2);

  // docketClerkCreatesAnOrder(cerebralTest, {
  //   documentContents: embedWithLegalIpsumText('nasty weather'),
  //   documentTitle: 'welcome to something flavortown today',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkSignsOrder(cerebralTest, 3);
  // docketClerkAddsDocketEntryFromOrder(cerebralTest, 3);
  // docketClerkServesDocument(cerebralTest, 3);

  // docketClerkCreatesAnOrder(cerebralTest, {
  //   documentContents: embedWithLegalIpsumText('welcome from flavortown'),
  //   documentTitle: 'welcome from flavortown',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkSignsOrder(cerebralTest, 4);
  // docketClerkAddsDocketEntryFromOrder(cerebralTest, 4);
  // docketClerkServesDocument(cerebralTest, 4);

  // docketClerkCreatesAnOrder(cerebralTest, {
  //   documentContents: embedWithLegalIpsumText('welcome to flavor-town'),
  //   documentTitle: 'welcome to flavor-town',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkSignsOrder(cerebralTest, 5);
  // docketClerkAddsDocketEntryFromOrder(cerebralTest, 5);
  // docketClerkServesDocument(cerebralTest, 5);

  // docketClerkCreatesAnOrder(cerebralTest, {
  //   documentContents: embedWithLegalIpsumText('welcome to flavortown.'),
  //   documentTitle: 'burning down the house',
  //   eventCode: 'O',
  //   expectedDocumentType: 'Order',
  //   signedAtFormatted: '01/02/2020',
  // });
  // docketClerkSignsOrder(cerebralTest, 6);
  // docketClerkAddsDocketEntryFromOrder(cerebralTest, 6);
  // docketClerkServesDocument(cerebralTest, 6);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('searches for an order by keyword `"welcome to flavortown"`', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        docketNumber: cerebralTest.docketNumber,
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
          docketNumber: cerebralTest.docketNumber,
        }),
      ]),
    );

    expect(searchResults.length).toEqual(1);
  });
});
