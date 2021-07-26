import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';

const testPublic = setupTest();
const testClient = setupTestClient();

testClient.draftOrders = [];
const createdDocketNumbers = [];

// eslint-disable-next-line @miovision/disallow-date/no-new-date
const documentTitleKeyword = `Sunglasses_${new Date().getTime()}`;
const nonExactDocumentTitleKeyword = `${documentTitleKeyword}y`;

// Temporarily disabled for story 7387
describe.skip(`Create and serve a case with an order with exact keyword (${documentTitleKeyword})`, () => {
  describe('Petitioner creates case', () => {
    beforeAll(() => {
      jest.setTimeout(30000);
    });

    afterAll(() => {
      testPublic.closeSocket();
    });

    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient);

      expect(caseDetail.docketNumber).toBeDefined();
      testClient.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);
  });

  describe('Docket clerk creates the first order on the case', () => {
    loginAs(testClient, 'docketclerk@example.com');

    docketClerkCreatesAnOrder(testClient, {
      documentContents: 'pigeon',
      documentTitle: documentTitleKeyword,
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(testClient, 0);
    docketClerkAddsDocketEntryFromOrder(testClient, 0);
    docketClerkServesDocument(testClient, 0);
  });

  describe('Docket clerk creates the second order on the case', () => {
    loginAs(testClient, 'docketclerk@example.com');

    docketClerkCreatesAnOrder(testClient, {
      documentContents: 'pigeon',
      documentTitle: nonExactDocumentTitleKeyword,
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });

    docketClerkSignsOrder(testClient, 1);
    docketClerkAddsDocketEntryFromOrder(testClient, 1);
    docketClerkServesDocument(testClient, 1);
  });
});

// Temporarily disabled for story 7387
describe.skip('Unauthed user searches for exact keyword', () => {
  it('user navigates to public site', async () => {
    await refreshElasticsearchIndex();
    await testPublic.runSequence('navigateToPublicSiteSequence', {});

    testPublic.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    expect(testPublic.currentRouteUrl).toEqual(
      applicationContext.getPublicSiteUrl(),
    );
  });

  it('searches for an order by keyword', async () => {
    testPublic.setState('advancedSearchForm', {
      orderSearch: {
        keyword: documentTitleKeyword,
      },
    });

    await testPublic.runSequence('submitPublicOrderAdvancedSearchSequence');

    const searchResults = testPublic.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toMatchObject([
      {
        docketNumber: createdDocketNumbers[0],
        documentTitle: documentTitleKeyword,
      },
    ]);

    const nonExactResult = searchResults.find(
      record => record.documentTitle === nonExactDocumentTitleKeyword,
    );
    expect(nonExactResult).toBeFalsy(); // non exact result not returned
  });

  it('searches for an order by partial keyword', async () => {
    testPublic.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Sun',
      },
    });

    await testPublic.runSequence('submitPublicOrderAdvancedSearchSequence');

    const searchResults = testPublic.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toMatchObject([]);
  });

  it('searches for an order with special characters', async () => {
    testPublic.setState('advancedSearchForm', {
      orderSearch: {
        keyword: `${documentTitleKeyword}!^&*`,
      },
    });

    await testPublic.runSequence('submitPublicOrderAdvancedSearchSequence');

    const searchResults = testPublic.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.ORDER}`,
    );

    expect(searchResults).toMatchObject([
      {
        docketNumber: createdDocketNumbers[0],
        documentTitle: documentTitleKeyword,
      },
    ]);

    const nonExactResult = searchResults.find(
      record => record.documentTitle === nonExactDocumentTitleKeyword,
    );
    expect(nonExactResult).toBeFalsy(); // non exact result not returned
  });
});
