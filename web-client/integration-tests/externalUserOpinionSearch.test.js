import {
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../shared/src/business/entities/EntityConstants';
import {
  loginAs,
  setOpinionSearchEnabled,
  setupTest,
  updateOpinionForm,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
const cerebralTest = setupTest();

describe('verify opinion search works for external users', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });
  // case 1 - sealed case
  // log in as associated private practitioner and search for opinion
  // log in as associated irs practitioner and search for opinion

  // case 2 - not-sealed case
  // log in as associated private practitioner and search for opinion
  // log in as associated irs practitioner and search for opinion

  // case 3 - sealed case
  // log in as non-associated private practitioner and search for opinion
  // log in as non-associated irs practitioner and search for opinion

  // case 4 - not-sealed case
  // log in as non-associated private practitioner and search for opinion
  // log in as non-associated irs practitioner and search for opinion

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setOpinionSearchEnabled(true);
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case 1', async () => {
    // log in as petitioner and create a case
    const caseDetail = await uploadPetition(cerebralTest, {});
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;

    // log in as petitions clerk (or docket clerk?), add practitioners and serve petition
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkAddsPractitionersToCase(cerebralTest);
    petitionsClerkServesPetitionFromDocumentView(cerebralTest);

    // log in as docket clerk
    loginAs(cerebralTest, 'docketclerk@example.com');
  });

  it('Create test case 2', async () => {
    // log in as petitioner and create a case
    const caseDetail = await uploadPetition(cerebralTest, {});
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;

    // log in as petitions clerk (or docket clerk?), add practitioners and serve petition
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkAddsPractitionersToCase(cerebralTest);
    petitionsClerkServesPetitionFromDocumentView(cerebralTest);

    // log in as docket clerk
    loginAs(cerebralTest, 'docketclerk@example.com');
  });

  // add opinion, serve opinion
  // seal case 1

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

    // describe('unsealed and associated', () => {
    //   loginAs(cerebralTest, 'petitioner@example.com');
    //   it('Create test case', async () => {
    //     const caseDetail = await uploadPetition(cerebralTest, {
    //       contactSecondary: {
    //         address1: '734 Cowley Parkway',
    //         city: 'Amazing',
    //         countryType: COUNTRY_TYPES.DOMESTIC,
    //         name: 'Jimothy Schultz',
    //         phone: '+1 (884) 358-9729',
    //         postalCode: '77546',
    //         state: 'AZ',
    //       },
    //       partyType: PARTY_TYPES.petitionerSpouse,
    //     });
    //     expect(caseDetail.docketNumber).toBeDefined();
    //     cerebralTest.docketNumber = caseDetail.docketNumber;
    //   });
    //
    //   loginAs(cerebralTest, 'petitionsclerk@example.com');
    //
    //   it('should return record', async () => {
    //     await addPracti;
    //   });
    // });
  });
});
