import {
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsOpiniontoDocketyEntry } from './journey/docketClerkAddsOpinionToDocketEntry';
import { docketClerkCreatesAnOpinion } from './journey/docketClerkCreatesAnOpinion';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import {
  fakeFile,
  loginAs,
  setOpinionSearchEnabled,
  setupTest,
  updateOpinionForm,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { userClicksDocketRecordLink } from './journey/userClicksDocketRecordLink';
import { userSearchesForOpinionByDocketNumber } from './journey/userSearchesForOpinionByDocketNumber';

const cerebralTest = setupTest();
const searchParams = {};
const expectedObjectContents = {};
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('verify opinion search works for external users', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOpinionSearchEnabled(true);
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  // log in as petitions clerk, add practitioners and serve petition
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest);
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  // log in as docket clerk, add an opinion, docket entry, and serve
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOpinion(cerebralTest, fakeFile);
  docketClerkAddsOpiniontoDocketyEntry(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);

  describe('IRS and private practitioners search for opinion in sealed and non-sealed cases by docket number', () => {
    it('sets searchParams and expectedObjectContents', async () => {
      searchParams.docketNumber = cerebralTest.docketNumber;
      expectedObjectContents.docketNumber = cerebralTest.docketNumber;
    });
    // associated irs practitioner - unsealed case
    loginAs(cerebralTest, 'irsPractitioner@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // associated private practitioner - unsealed case
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // unassociated irs practitioner - unsealed case
    loginAs(cerebralTest, 'irsPractitioner2@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // unassociated private practitioner - unsealed case
    loginAs(cerebralTest, 'privatePractitioner2@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // seal the case
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSealsCase(cerebralTest);

    // associated irs practitioner - sealed case
    loginAs(cerebralTest, 'irsPractitioner@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // associated private practitioner - sealed case
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // unassociated irs practitioner - sealed case
    loginAs(cerebralTest, 'irsPractitioner2@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, false);

    // unassociated private practitioner - sealed case
    loginAs(cerebralTest, 'privatePractitioner2@example.com');
    userSearchesForOpinionByDocketNumber(
      cerebralTest,
      searchParams,
      expectedObjectContents,
    );
    userClicksDocketRecordLink(cerebralTest, false);

    it('unsets searchParams and expectedObjectContents', async () => {
      delete searchParams.docketNumber;
      delete expectedObjectContents.docketNumber;
    });
  });

  describe('private practitioner performs opinion search', () => {
    loginAs(cerebralTest, 'privatePractitioner@example.com');

    it('should return an opinion from a sealed case', async () => {
      // Private/IRS practitioner accesses Opinion Search, searches for Opinion in sealed case, Opinion is returned in results list.
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        keyword: 'sunglasses',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      expect(stateOfAdvancedSearch).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
        ]),
      );
    });

    it('should not return an opinion that does not match', async () => {
      // Private/IRS practitioner accesses Opinion Search, searches for Opinion in sealed case, Opinion is returned in results list.
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await updateOpinionForm(cerebralTest, {
        keyword: 'sunglasses',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      expect(stateOfAdvancedSearch).not.toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
          expect.objectContaining({
            docketEntryId: 'd085a9da-b4a6-41d2-aa40-f933fe2d4188',
            documentTitle:
              'Summary Opinion Judge Ashford An opinion for testing',
          }),
        ]),
      );
    });

    //Private/IRS practitioner accesses Opinion Search, searches using no keyword/phrase. Results list is returned.
    it('should return results with no keyword/phrase', async () => {
      await cerebralTest.runSequence('gotoAdvancedSearchSequence');
      cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

      await updateOpinionForm(cerebralTest, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      });

      await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
      expect(cerebralTest.getState('validationErrors')).toEqual({});

      const stateOfAdvancedSearch = cerebralTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
      );

      expect(stateOfAdvancedSearch).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
            documentTitle:
              'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
          }),
          expect.objectContaining({
            docketEntryId: 'd085a9da-b4a6-41d2-aa40-f933fe2d4188',
            documentTitle:
              'Summary Opinion Judge Ashford An opinion for testing',
          }),
        ]),
      );
    });

    describe('keywords/phrases AND filters for docket record and Petitioner/case name', () => {
      // Private/IRS practitioner accesses Opinion Search, searches using combination of keyword/phrase and filters. Results list is returned.
      it('should return results with keyword/phrase and filters for docket record', async () => {
        await cerebralTest.runSequence('gotoAdvancedSearchSequence');
        cerebralTest.setState(
          'advancedSearchTab',
          ADVANCED_SEARCH_TABS.OPINION,
        );

        await updateOpinionForm(cerebralTest, {
          dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
          docketNumber: '105-20',
          keyword: 'sunglasses',
        });

        await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
        expect(cerebralTest.getState('validationErrors')).toEqual({});

        const stateOfAdvancedSearch = cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
        );

        expect(stateOfAdvancedSearch).toMatchObject(
          expect.arrayContaining([
            expect.objectContaining({
              docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
              documentTitle:
                'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
            }),
          ]),
        );
      });

      it('should NOT return results with keyword/phrase and filters for docket record', async () => {
        await cerebralTest.runSequence('gotoAdvancedSearchSequence');
        cerebralTest.setState(
          'advancedSearchTab',
          ADVANCED_SEARCH_TABS.OPINION,
        );

        await updateOpinionForm(cerebralTest, {
          dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
          docketNumber: '200-20',
          keyword: 'sunglasses',
        });

        await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
        expect(cerebralTest.getState('validationErrors')).toEqual({});

        const stateOfAdvancedSearch = cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
        );

        expect(stateOfAdvancedSearch).toEqual([]);
      });

      it('should return results with keyword/phrase and filters for Petitioner/case name', async () => {
        await cerebralTest.runSequence('gotoAdvancedSearchSequence');
        cerebralTest.setState(
          'advancedSearchTab',
          ADVANCED_SEARCH_TABS.OPINION,
        );

        await updateOpinionForm(cerebralTest, {
          caseTitleOrPetitioner: 'Astra Santiago',
          dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
          keyword: 'sunglasses',
        });

        await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
        expect(cerebralTest.getState('validationErrors')).toEqual({});

        const stateOfAdvancedSearch = cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
        );

        expect(stateOfAdvancedSearch).toMatchObject(
          expect.arrayContaining([
            expect.objectContaining({
              docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
              documentTitle:
                'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
            }),
          ]),
        );
      });

      it('should NOT return results with keyword/phrase and filters for docket record', async () => {
        await cerebralTest.runSequence('gotoAdvancedSearchSequence');
        cerebralTest.setState(
          'advancedSearchTab',
          ADVANCED_SEARCH_TABS.OPINION,
        );

        await updateOpinionForm(cerebralTest, {
          caseTitleOrPetitioner: 'Anything',
          keyword: 'sunglasses',
        });

        await cerebralTest.runSequence('submitOpinionAdvancedSearchSequence');
        expect(cerebralTest.getState('validationErrors')).toEqual({});

        const stateOfAdvancedSearch = cerebralTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.OPINION}`,
        );

        expect(stateOfAdvancedSearch).toEqual([]);
      });
    });
  });
});
