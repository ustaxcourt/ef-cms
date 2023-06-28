import {
  addDocketEntryAndServeOpinion,
  createOpinion,
  goToOpinionSearch,
  gotoAdvancedPractitionerSearch,
  gotoAdvancedSearch,
  searchByDocketNumber,
  searchByPetitionerName,
  searchByPractitionerName,
  searchByPractitionerbarNumber,
  searchOpinionByKeyword,
} from '../support/pages/advanced-search';

import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import { goToCaseDetail } from '../support/pages/case-detail';
import {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} from '../support/pages/create-paper-case';
import { goToMyDocumentQC } from '../support/pages/document-qc';
import { waitForElasticsearch } from '../support/helpers';

const barNumberToSearchBy = 'PT1234';
let testData = {};
let token;
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

const { closeScannerSetupDialog, login } = getEnvironmentSpecificFunctions();

describe('Create and serve a case to search for', () => {
  before(() => {
    cy.task('getUserToken', {
      email: 'petitionsclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
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
    waitForElasticsearch();
  });
});

describe('Case Advanced Search', () => {
  before(() => {
    cy.task('getUserToken', {
      email: 'docketclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
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
  before(() => {
    cy.task('getUserToken', {
      email: 'docketclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
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

describe('Opinion Search', () => {
  before(() => {
    cy.task('getUserToken', {
      email: 'docketclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should create an opinion to search for', () => {
    goToCaseDetail(testData.createdPaperDocketNumber);
    createOpinion();
    addDocketEntryAndServeOpinion(testData);
    waitForElasticsearch();
  });

  it('should be able to search for an opinion by keyword', () => {
    goToOpinionSearch();
    searchOpinionByKeyword(testData.documentDescription);
  });
});
