const {
  addDocketEntryAndServeOpinion,
  createOpinion,
  gotoAdvancedPractitionerSearch,
  gotoAdvancedSearch,
  goToOpinionSearch,
  searchByDocketNumber,
  searchByPetitionerName,
  searchByPractitionerbarNumber,
  searchByPractitionerName,
  searchOpinionByKeyword,
} = require('../support/pages/advanced-search');
const {
  fillInCreateCaseFromPaperForm,
} = require('../../cypress/support/pages/create-paper-petition');
const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} = require('../support/pages/create-paper-case');
const { goToCaseDetail } = require('../support/pages/case-detail');
const { goToMyDocumentQC } = require('../support/pages/document-qc');

const barNumberToSearchBy = 'PT1234';
let testData = {};
let token;
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

const {
  closeScannerSetupDialog,
  getUserToken,
  login,
} = getEnvironmentSpecificFunctions();

describe('Create and serve a case to search for', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create a case and serve to IRS', () => {
    goToMyDocumentQC();
    goToCreateCase();
    closeScannerSetupDialog();
    fillInCreateCaseFromPaperForm(testData);
    goToReviewCase(testData);
    serveCaseToIrs();
  });
});

describe('Case Advanced Search', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to search for case by petitioner name', () => {
    gotoAdvancedSearch();
    searchByPetitionerName(testData.testPetitionerName);
  });

  it('should be able to search for case by docket number', () => {
    gotoAdvancedSearch();
    searchByDocketNumber(testData.createdPaperDocketNumber);
  });
});

describe('Practitioner Search', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to search for a practitioner by name', () => {
    gotoAdvancedPractitionerSearch();
    searchByPractitionerName();
  });

  it('should be able to search for for a practitioner by bar number', () => {
    gotoAdvancedPractitionerSearch();
    searchByPractitionerbarNumber(barNumberToSearchBy);
  });
});

// Temporarily disabled for story 7387
describe.skip('Opinion Search', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should create an opinion to search for', () => {
    goToCaseDetail(testData.createdPaperDocketNumber);
    createOpinion();
    addDocketEntryAndServeOpinion(testData);
  });

  it('should be able to search for an opinion by keyword', () => {
    goToOpinionSearch();
    searchOpinionByKeyword(testData.documentDescription);
  });
});
