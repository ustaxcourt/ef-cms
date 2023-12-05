import {
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_TABS,
  BENCH_OPINION_EVENT_CODE,
} from '../../shared/src/business/entities/EntityConstants';
import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserAppliesSignatureToDraftDocument } from './journey/chambersUserAppliesSignatureToDraftDocument';
import { chambersUserSavesSignatureForDraftDocument } from './journey/chambersUserSavesSignatureForDraftDocument';
import { chambersUserViewsSignDraftDocument } from './journey/chambersUserViewsSignDraftDocument';
import { docketClerkAddsOSTDocketEntryFromOrder } from './journey/docketClerkAddsOSTDocketEntryFromOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  updateOpinionForm,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Bench opinion advanced search journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a new case and serve to IRS', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('login as a petitioner and create a case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();

      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);
  });

  describe('Create a bench opinion, sign as Judge Buch, and serve the document', () => {
    loginAs(cerebralTest, 'buchschambers@example.com');
    chambersUserAddsOrderToCase(cerebralTest);
    chambersUserViewsSignDraftDocument(cerebralTest);
    chambersUserAppliesSignatureToDraftDocument(cerebralTest, {
      judgeName: 'Ronald L. Buch',
      judgeTitle: 'Judge',
    });
    chambersUserSavesSignatureForDraftDocument(cerebralTest);

    loginAs(cerebralTest, 'docketclerk1@example.com');
    docketClerkAddsOSTDocketEntryFromOrder(cerebralTest, 0);
    docketClerkServesDocument(cerebralTest, 0);
  });

  describe('Create a bench opinion, sign as Judge Ashford, and serve the document', () => {
    loginAs(cerebralTest, 'ashfordschambers@example.com');
    chambersUserAddsOrderToCase(cerebralTest);
    chambersUserViewsSignDraftDocument(cerebralTest);
    chambersUserAppliesSignatureToDraftDocument(cerebralTest, {
      judgeName: 'Tamara W. Ashford',
      judgeTitle: 'Judge',
    });
    chambersUserSavesSignatureForDraftDocument(cerebralTest);

    loginAs(cerebralTest, 'docketclerk1@example.com');
    docketClerkAddsOSTDocketEntryFromOrder(cerebralTest, 0);
    docketClerkServesDocument(cerebralTest, 0);
  });

  describe('Advanced search for Bench opinions', () => {
    it('go to advanced opinion search tab', async () => {
      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);
    });

    it('search for bench opinions, expect to see the two that were just created', async () => {
      await updateOpinionForm(cerebralTest, {
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
      ).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketNumber: cerebralTest.docketNumber,
            eventCode: BENCH_OPINION_EVENT_CODE,
            signedJudgeName: 'Ronald L. Buch',
          }),
          expect.objectContaining({
            docketNumber: cerebralTest.docketNumber,
            eventCode: BENCH_OPINION_EVENT_CODE,
            signedJudgeName: 'Tamara W. Ashford',
          }),
        ]),
      );
    });
  });

  describe('Create a bench opinion, sign as Judge Ashford, and serve the document', () => {
    loginAs(cerebralTest, 'ashfordschambers@example.com');
    chambersUserAddsOrderToCase(cerebralTest);
    chambersUserViewsSignDraftDocument(cerebralTest);
    chambersUserAppliesSignatureToDraftDocument(cerebralTest, {
      judgeName: 'Tamara W. Ashford',
      judgeTitle: 'Judge',
    });
    chambersUserSavesSignatureForDraftDocument(cerebralTest);

    loginAs(cerebralTest, 'docketclerk1@example.com');
    docketClerkAddsOSTDocketEntryFromOrder(cerebralTest, 0);
    docketClerkServesDocument(cerebralTest, 0);
  });

  describe('Advanced search for Bench opinions with judge filter', () => {
    it('go to advanced opinion search tab', async () => {
      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);
    });

    it('search for bench opinions with judge = "Ashford"', async () => {
      await updateOpinionForm(cerebralTest, {
        judge: 'Tamara W. Ashford',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');

      const searchResults = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );
      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(searchResults).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketNumber: cerebralTest.docketNumber,
            eventCode: BENCH_OPINION_EVENT_CODE,
            signedJudgeName: 'Tamara W. Ashford',
          }),
          expect.objectContaining({
            docketNumber: cerebralTest.docketNumber,
            eventCode: BENCH_OPINION_EVENT_CODE,
            signedJudgeName: 'Tamara W. Ashford',
          }),
        ]),
      );
      expect(
        searchResults.find(r => r.signedJudgeName !== 'Tamara W. Ashford'),
      ).toBeUndefined();
    });
  });
});
