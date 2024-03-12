/* eslint-disable security/detect-non-literal-regexp */
import {
  ADVANCED_SEARCH_OPINION_TYPES,
  COUNTRY_TYPES,
  DATE_RANGE_SEARCH_OPTIONS,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsOpiniontoDocketyEntry } from './journey/docketClerkAddsOpinionToDocketEntry';
import { docketClerkCreatesAnOpinion } from './journey/docketClerkCreatesAnOpinion';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import {
  fakeFile,
  loginAs,
  setOpinionSearchEnabled,
  setupTest,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { userClicksDocketRecordLink } from './journey/userClicksDocketRecordLink';
import { userPerformsAdvancedOpinionSearch } from './journey/userPerformsAdvancedOpinionSearch';

describe('verify opinion search works for external users', () => {
  const cerebralTest = setupTest();

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
    const getSearchParams = () => ({ docketNumber: cerebralTest.docketNumber });
    const expectedObjectContentsMatcher = () =>
      new RegExp(`"docketNumber":"${cerebralTest.docketNumber}"`);

    // associated irs practitioner - unsealed case
    loginAs(cerebralTest, 'irspractitioner@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // associated private practitioner - unsealed case
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // unassociated irs practitioner - unsealed case
    loginAs(cerebralTest, 'irspractitioner2@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // unassociated private practitioner - unsealed case
    loginAs(cerebralTest, 'privatePractitioner2@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // seal the case
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSealsCase(cerebralTest);

    // associated irs practitioner - sealed case
    loginAs(cerebralTest, 'irspractitioner@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // associated private practitioner - sealed case
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, true);

    // unassociated irs practitioner - sealed case
    loginAs(cerebralTest, 'irspractitioner2@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, false);

    // unassociated private practitioner - sealed case
    loginAs(cerebralTest, 'privatePractitioner2@example.com');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );
    userClicksDocketRecordLink(cerebralTest, false);
  });

  describe('private practitioner performs opinion search', () => {
    const colvinDocketEntryIdKeyValue =
      '"docketEntryId":"1a92894e-83a5-48ba-9994-3ada44235deb"';
    const ashfordDocketEntryIdKeyValue =
      '"docketEntryId":"1a92894e-83a5-48ba-9994-3ada44235deb"';
    const colvinOpinionDocumentTitleKeyValue =
      '"documentTitle":"T.C. Opinion Judge Colvin Some very strong opinions about sunglasses"';
    const ashfordOpinionDocumentTitleKeyValue =
      '"documentTitle":"Summary Opinion Judge Ashford An opinion for testing"';

    loginAs(cerebralTest, 'privatePractitioner@example.com');

    // Search by keyword with opinion type and date range where matches exist
    let getSearchParams = () => ({
      dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
      keyword: 'sunglasses',
      opinionTypes: {
        [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
      },
    });
    let expectedObjectContentsMatcher = () =>
      new RegExp(
        `${colvinDocketEntryIdKeyValue}.*${colvinOpinionDocumentTitleKeyValue}`,
      );
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );

    // Search by keyword with opinion types where no match exists
    getSearchParams = () => ({
      keyword: 'abcdefghijklmnopqrstuvwxyz',
      opinionTypes: {
        [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
        [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
        [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
        [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
      },
    });
    expectedObjectContentsMatcher = () => new RegExp('"opinion":\\[]');
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );

    //Private/IRS practitioner accesses Opinion Search, searches using no keyword/phrase. Results list is returned.
    // Search by no keyword with opinion types and date range where matches exist
    getSearchParams = () => ({
      dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
      opinionTypes: {
        [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
        [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
      },
    });
    expectedObjectContentsMatcher = () =>
      new RegExp(
        `${ashfordDocketEntryIdKeyValue}.*${ashfordOpinionDocumentTitleKeyValue}.*${colvinDocketEntryIdKeyValue}.*${colvinOpinionDocumentTitleKeyValue}`,
      );
    userPerformsAdvancedOpinionSearch(
      cerebralTest,
      getSearchParams,
      expectedObjectContentsMatcher,
    );

    describe('keywords/phrases AND filters for docket record and Petitioner/case name', () => {
      // Private/IRS practitioner accesses Opinion Search, searches using combination of keyword/phrase and filters. Results list is returned.
      // Search by docket number and keyword where matches exist
      getSearchParams = () => ({
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        docketNumber: '105-20',
        keyword: 'sunglasses',
      });
      expectedObjectContentsMatcher = () =>
        new RegExp(
          `${colvinDocketEntryIdKeyValue}.*${colvinOpinionDocumentTitleKeyValue}`,
        );
      userPerformsAdvancedOpinionSearch(
        cerebralTest,
        getSearchParams,
        expectedObjectContentsMatcher,
      );

      // Search by docket number and keyword where no matches exist
      getSearchParams = () => ({
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        docketNumber: '200-20',
        keyword: 'sunglasses',
      });
      expectedObjectContentsMatcher = () => new RegExp('"opinion":\\[]');
      userPerformsAdvancedOpinionSearch(
        cerebralTest,
        getSearchParams,
        expectedObjectContentsMatcher,
      );

      // Search by petitioner/case name and keyword where matches exist
      getSearchParams = () => ({
        caseTitleOrPetitioner: 'Astra Santiago',
        dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
        keyword: 'sunglasses',
      });
      expectedObjectContentsMatcher = () =>
        new RegExp(
          `${colvinDocketEntryIdKeyValue}.*${colvinOpinionDocumentTitleKeyValue}`,
        );
      userPerformsAdvancedOpinionSearch(
        cerebralTest,
        getSearchParams,
        expectedObjectContentsMatcher,
      );

      // Search by petitioner/case name and keyword where no matches exist
      getSearchParams = () => ({
        caseTitleOrPetitioner: 'Anything',
        keyword: 'sunglasses',
      });
      expectedObjectContentsMatcher = () => new RegExp('"opinion":\\[]');
      userPerformsAdvancedOpinionSearch(
        cerebralTest,
        getSearchParams,
        expectedObjectContentsMatcher,
      );
    });
  });
});
