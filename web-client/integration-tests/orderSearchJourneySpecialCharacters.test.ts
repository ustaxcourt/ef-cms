import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
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

describe('order search journey with special characters', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

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

  it('Creates case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('Welcome to washington D.C.'),
    documentTitle: 'Welcome Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('Girardi & Assoc.'),
    documentTitle: 'Girardi',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
  docketClerkServesDocument(cerebralTest, 1);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('Johnson & Johnson'),
    documentTitle: 'JJ Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  docketClerkServesDocument(cerebralTest, 2);

  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('Coca-Cola'),
    documentTitle: 'CC Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 3);
  docketClerkServesDocument(cerebralTest, 3);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('searches for D.C.', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoAdvancedSearchSequence');
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        docketNumber: cerebralTest.docketNumber,
        keyword: 'D.C.',
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
          documentTitle: 'Welcome Order',
        }),
      ]),
    );

    expect(searchResults.length).toEqual(1);
  });

  [
    'Girardi & Assoc.',
    'girardi & assoc.',
    'girardi assoc.',
    '"Girardi & Assoc."',
  ].forEach(term => {
    it(`searches for ${term}`, async () => {
      await refreshElasticsearchIndex();
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: term,
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
            docketNumber: cerebralTest.docketNumber,
            documentTitle: 'Girardi',
          }),
        ]),
      );

      expect(searchResults.length).toEqual(1);
    });
  });

  ['Johnson & Johnson', 'johnson johnson', '"Johnson & Johnson"'].forEach(
    term => {
      it(`searches for ${term}`, async () => {
        await refreshElasticsearchIndex();
        await cerebralTest.runSequence('gotoAdvancedSearchSequence');
        cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

        cerebralTest.setState('advancedSearchForm', {
          orderSearch: {
            docketNumber: cerebralTest.docketNumber,
            keyword: term,
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
              docketNumber: cerebralTest.docketNumber,
              documentTitle: 'JJ Order',
            }),
          ]),
        );

        expect(searchResults.length).toEqual(1);
      });
    },
  );

  ['Coca-Cola', 'coca cola', '"Coca-Cola"'].forEach(term => {
    it(`searches for ${term}`, async () => {
      await refreshElasticsearchIndex();
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

      cerebralTest.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: cerebralTest.docketNumber,
          keyword: term,
        },
      });

      await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
      );

      expect(searchResults).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: cerebralTest.draftOrders[3].docketEntryId,
            docketNumber: cerebralTest.docketNumber,
            documentTitle: 'CC Order',
          }),
        ]),
      );

      expect(searchResults.length).toEqual(1);
    });
  });
});
