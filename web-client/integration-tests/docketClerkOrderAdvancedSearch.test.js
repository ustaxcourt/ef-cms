import { OrderSearch } from '../../shared/src/business/entities/orders/OrderSearch';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
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

  const seedData = {
    caseCaption: 'Hanan Al Hroub, Petitioner',
    caseId: '1a92894e-83a5-48ba-9994-3ada44235deb',
    contactPrimary: {
      address1: '123 Teachers Way',
      city: 'Haifa',
      country: 'Palestine',
      countryType: 'international',
      name: 'Hanan Al Hroub',
      postalCode: '123456',
      serviceIndicator: 'Paper',
    },
    contactSecondary: {},
    docketNumber: '104-20',
    docketNumberSuffix: 'R',
    documentContents:
      'Déjà vu, this is a seed order filed on Apr 13 at 11:01pm ET',
    documentId: 'f1aa4aa3-c214-424c-8870-d0049c5744d7',
    documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
    filingDate: '2020-04-14T03:01:15.215Z',
    signedJudgeName: 'Maurice B. Foley',
  };

  const signedByJudge = 'Maurice B. Foley';
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
  docketClerkSealsCase(test);

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

  it('search for a keyword that is present in served orders', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.draftOrders[2].documentId,
          isSealed: true,
        }),
      ]),
    );
    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentId: test.draftOrders[1].documentId }),
      ]),
    );
  });

  it('search for a docket number that is not present in any served orders', async () => {
    const docketNumberNoOrders = '999-99';

    test.setState('advancedSearchForm', {
      orderSearch: {
        docketNumber: docketNumberNoOrders,
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual([]);
  });

  it('search for a docket number that is present in served orders', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        docketNumber: caseDetail.docketNumber,
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

  it('clears search fields', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: caseDetail.caseCaption,
        docketNumber: caseDetail.docketNumber,
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'orderSearch',
    });

    expect(test.getState('advancedSearchForm.orderSearch')).toEqual({
      orderKeyword: '',
    });
  });

  it('search for a case title that is not present in any served orders', async () => {
    const caseCaptionNoOrders = 'abcdefghijk';

    test.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: caseCaptionNoOrders,
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual([]);
  });

  it('search for a case title that is present in served orders', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        caseTitleOrPetitioner: caseDetail.caseCaption,
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

  it('search for a date range that does not contain served orders', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        endDateDay: '03',
        endDateMonth: '01',
        endDateYear: '2005',
        orderKeyword: 'dismissal',
        startDateDay: '01',
        startDateMonth: '01',
        startDateYear: '2005',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual([]);
  });

  it('search for a date range that contains served orders', async () => {
    const currentDate = new Date();
    const orderCreationYear = currentDate.getUTCFullYear();
    const orderCreationMonth = currentDate.getUTCMonth() + 1;
    const orderCreationDate = currentDate.getDate();

    test.setState('advancedSearchForm', {
      orderSearch: {
        endDateDay: orderCreationDate,
        endDateMonth: orderCreationMonth,
        endDateYear: orderCreationYear,
        orderKeyword: 'dismissal',
        startDateDay: orderCreationDate,
        startDateMonth: orderCreationMonth,
        startDateYear: orderCreationYear,
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

  it('search for a judge that has not signed any served orders', async () => {
    const invalidJudge = 'Judge Exotic';

    test.setState('advancedSearchForm', {
      orderSearch: {
        judge: invalidJudge,
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual([]);
  });

  it('search for a judge that has signed served orders', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        judge: signedByJudge,
        orderKeyword: 'dismissal',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentId: seedData.documentId }),
      ]),
    );
    expect(test.getState('searchResults')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentId: test.draftOrders[2].documentId }),
      ]),
    );
  });

  it('includes the number of pages present in each document in the search results', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        orderKeyword: 'Order of Dismissal Entered',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          numberOfPages: 1,
        }),
      ]),
    );
  });
});
