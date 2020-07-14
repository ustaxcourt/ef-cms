const {
  addStatistic,
  confirmServePetition,
  goToMyDocumentQC,
  goToPetitionNeedingQC,
  goToPetitionNeedingQCByCaseTitle,
  goToReviewPetition,
  goToSectionDocumentQC,
  savePetitionForLater,
  selectCaseType,
  selectTab,
  servePetition,
} = require('../support/pages/document-qc');
const {
  goToCaseDetail,
  goToFileADocument,
  goToFileYourDocument,
  goToReviewDocument,
  goToSelectDocumentType,
  selectDocumentType,
  submitDocument,
  uploadDocumentFile,
} = require('../support/pages/petitioner-dashboard');
const { getUserToken, login } = require('../support/pages/login');

let token = null;

// This test is a work in progress. We need to chat about an approach for using
// test data that's consistent on all environments: https://trello.com/c/ZYDJzXay/567-filings-and-qc
describe.skip('Petitions clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to QC a petition and save for later', () => {
    goToMyDocumentQC();
    goToSectionDocumentQC();
    goToPetitionNeedingQC();
    goToReviewPetition();
    savePetitionForLater();
  });

  it('should be able to QC a petition, add statistics, and serve to IRS', () => {
    goToMyDocumentQC();
    goToSectionDocumentQC();
    goToPetitionNeedingQCByCaseTitle('Petitioner');
    selectTab('irs-notice');
    // radio button not selected - bug?
    cy.get('#has-irs-verified-notice-yes').click();
    selectCaseType('Deficiency');
    addStatistic('2020', '1000', '10');
    goToReviewPetition();
    servePetition();
    confirmServePetition();
  });
});

describe.skip('Petitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'petitioner1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to file a document', () => {
    goToCaseDetail('Petitioner');
    goToFileADocument();
    goToSelectDocumentType();
    selectDocumentType('Administrative Record');
    goToFileYourDocument();
    uploadDocumentFile();
    goToReviewDocument();
    submitDocument();
  });
});

describe.skip('Private practitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'petitioner1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to file a document', () => {});
});
