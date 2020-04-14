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

  let caseDetail;

  loginAs(test, 'petitioner');
  it('create case', async () => {
    caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrder(test, 0);

  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);

  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 2);
  docketClerkServesOrder(test, 2);

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

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentId: test.draftOrders[2].documentId }),
      ]),
    );
    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentId: test.draftOrders[1].documentId }),
      ]),
    );
  });
});
