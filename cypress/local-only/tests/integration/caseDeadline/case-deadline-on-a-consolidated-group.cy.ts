import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createAndServeConsolidatedGroup,
  GroupInfoType,
} from 'cypress/helpers/fileAPetition/create-consolidated-case-group';

describe('Case Deadline - Consolidated Group', () => {
  const JUDGE_NAME = 'Ashford';
  const CASE_STATUS = CASE_STATUS_TYPES.submitted;
  const CASE_YEAR = '2025';

  before(() => {
    createAndServeConsolidatedGroup({
      caseStatus: CASE_STATUS,
      leadCaseJudge: JUDGE_NAME,
      memeberCaseJudge: JUDGE_NAME,
      numberOfMemberCases: 2,
      leadYearReceived: CASE_YEAR,
      memberYearReceived: CASE_YEAR,
    }).then(consolidatedGroupInfo => {
      cy.wrap<GroupInfoType>(consolidatedGroupInfo).as('GROUP_INFO');
    });
  });

  it('should add deadlines to all the children cases in the CG and bot update children removed from the group', () => {
    loginAsDocketClerk1();

    cy.get<GroupInfoType>('@GROUP_INFO').then(GROUP_INFO => {
      const { memberDocketNumbers, leadDocketNumber } = GROUP_INFO;
      goToCase(leadDocketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-deadline"]').click();

      cy.get('[id="deadline-date-picker"]').type('03/31/9999');
      cy.get('[data-testid="case-deadline-description-input"]').type(
        'John Is Testing',
      );

      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').contains('Deadline saved.');
      cy.get('[data-testid="tab-tracked-items"]').click();

      cy.get('.case-deadline-row').should('have.length', 1);
      cy.get('[data-testid="case-deadline-description"]').should(
        'have.text',
        'John Is Testing',
      );

      for (let index = 0; index < memberDocketNumbers.length; index++) {
        const docketNumber = memberDocketNumbers[index];
        goToCase(docketNumber);
        cy.get('[data-testid="tab-tracked-items"]').click();
        cy.get('.case-deadline-row').should('have.length', 1);

        cy.get('[data-testid="case-deadline-description"]').should(
          'have.text',
          'John Is Testing',
        );
      }

      const remainingMemberDocketNumbers = memberDocketNumbers.slice(0, -1);
      const removedDocketNumber =
        memberDocketNumbers[memberDocketNumbers.length - 1];
      goToCase(removedDocketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="unconsolidate-cases-button"]').click();
      cy.get(`.usa-checkbox`).last().click();
      cy.get('[data-testid="modal-confirm"]').click();

      goToCase(leadDocketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="case-deadline-edit-button"]').click();
      cy.get('[data-testid="case-deadline-description-input"]').type(
        ' Updated',
      );
      cy.get('[data-testid="modal-button-confirm"]').click();

      for (
        let index = 0;
        index < remainingMemberDocketNumbers.length;
        index++
      ) {
        const docketNumber = remainingMemberDocketNumbers[index];
        goToCase(docketNumber);
        cy.get('[data-testid="tab-tracked-items"]').click();
        cy.get('.case-deadline-row').should('have.length', 1);

        cy.get('[data-testid="case-deadline-description"]').should(
          'have.text',
          'John Is Testing Updated',
        );
      }

      goToCase(removedDocketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('.case-deadline-row').should('have.length', 1);
      cy.get('[data-testid="case-deadline-description"]').should(
        'have.text',
        'John Is Testing',
      );

      goToCase(leadDocketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="delete-case-deadline-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('.case-deadline-row').should('have.length', 1);
      for (
        let index = 0;
        index < remainingMemberDocketNumbers.length;
        index++
      ) {
        const docketNumber = remainingMemberDocketNumbers[index];
        goToCase(docketNumber);
        cy.get('[data-testid="tab-tracked-items"]').click();
        cy.get('.case-deadline-row').should('not.exist');
      }

      goToCase(removedDocketNumber);
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('.case-deadline-row').should('have.length', 1);
      cy.get('[data-testid="case-deadline-description"]').should(
        'have.text',
        'John Is Testing',
      );
    });
  });
});
