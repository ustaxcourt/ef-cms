import { OrderSearch } from '../../shared/src/business/entities/orders/OrderSearch';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { refreshElasticsearchIndex } from './helpers';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('docket clerk order advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.draftOrders = [];
  });

  const caseCreationCount = 3;
  let createdCases = [];

  loginAs(test, 'petitioner');
  for (let i = 0; i < caseCreationCount; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(test);
      createdCases.push(caseDetail);
    });
  }

  loginAs(test, 'docketclerk');

  it('set docket number', async () => {
    test.docketNumber = createdCases[0].docketNumber;
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrder(test, 0);

  it('set docket number', async () => {
    test.docketNumber = createdCases[0].docketNumber;
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  docketClerkServesOrder(test, 1);

  it('set docket number', async () => {
    test.docketNumber = createdCases[1].docketNumber;
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 2);
  docketClerkServesOrder(test, 2);

  // TODO - CANT CREATE THIS FOR SOME REASON, ASK FOR HELP ON MONDAY
  it('set docket number', async () => {
    test.docketNumber = createdCases[2].docketNumber;
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkAddsDocketEntryFromOrder(test, 3);
  docketClerkServesOrder(test, 3);

  it('go to advanced order search tab', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      orderKeyword: OrderSearch.VALIDATION_ERROR_MESSAGES.orderKeyword,
    });
  });

  it('search for a keyword that is not present in any served order', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'osteodontolignikeratic',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('searchResults')).toEqual([]);
  });

  it('search for a keyword which is present in served orders', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual([
      {
        caseCaption: 'Mona Schultz, Petitioner',
        caseId: '954179f9-e00e-40e2-b3e1-2e6d3cff2054',
        docketNumber: '105-20',
        docketNumberSuffix: 'L',
        documentId: '1ee72ece-a4d1-4b96-9279-bd6455741596',
        documentTitle: 'Order of Dismissal Entered, Judge Buch for Something',
        filingDate: '2020-04-10T21:45:04.340Z',
      },
      {
        caseCaption: 'Mona Schultz, Petitioner',
        caseId: 'bb690ddf-2be6-4d63-809b-c0bcc502f125',
        docketNumber: '109-20',
        docketNumberSuffix: 'L',
        documentId: 'f34c3e7a-280c-45e3-a2eb-1722ee64ead9',
        documentTitle: 'Order of Dismissal Entered, Judge Buch for Something',
        filingDate: '2020-04-10T21:33:07.908Z',
      },
    ]);
  });
});
