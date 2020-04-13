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

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentId: test.draftOrders[1].documentId }),
        expect.objectContaining({ documentId: test.draftOrders[2].documentId }),
      ]),
    );
  });
});
