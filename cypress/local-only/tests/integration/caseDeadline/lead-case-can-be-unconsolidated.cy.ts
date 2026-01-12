import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { faker } from '@faker-js/faker';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createAndServeConsolidatedGroup,
  GroupInfoType,
} from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import { attachFile } from 'cypress/helpers/file/upload-file';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';

describe('Case Deadline - Consolidated Group', () => {
  const JUDGE_NAME = 'Ashford';
  const CASE_STATUS = CASE_STATUS_TYPES.submitted;
  const CASE_YEAR = '2025';
  let groupInfo: GroupInfoType;

  before(() => {
    createAndServeConsolidatedGroup({
      caseStatus: CASE_STATUS,
      leadCaseJudge: JUDGE_NAME,
      memberCaseJudge: JUDGE_NAME,
      numberOfMemberCases: 1,
      leadYearReceived: CASE_YEAR,
      memberYearReceived: CASE_YEAR,
    }).then(consolidatedGroupInfo => {
      groupInfo = consolidatedGroupInfo;
    });
  });

  beforeEach(() => {
    cy.wrap(groupInfo).as('GROUP_INFO');
  });

  it('should unconsolidate a case without any issue when there are no deadlines', () => {
    loginAsDocketClerk1();

    cy.get<GroupInfoType>('@GROUP_INFO').then(GROUP_INFO => {
      console.log('GROUP_INFO', GROUP_INFO);
      const { leadDocketNumber } = GROUP_INFO;
      goToCase(leadDocketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();

      const title = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').type(title);
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
      cy.get('#apply-signature').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      selectTypeaheadInput(
        'court-issued-document-type-search',
        'Stipulated Decision',
      );

      cy.get('[data-testid="judge-select"]').select('Ashford');
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();
      cy.get('[data-testid="success-alert"]').contains('Document served.');
    });
  });
});
