import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Trial Sessions Planning', () => {
  describe('Trial Sessions Planning Report View', () => {
    it('should not display errors when user has not selected any option in dropdowns', () => {
      loginAsDocketClerk1();
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="trial-session-planning-report-button"]').click();

      cy.get('[data-testid="trial-session-planning-report-term-selector"]')
        .find('option')
        .last()
        .then(option => {
          const optionValue = option.val()!;
          cy.get(
            '[data-testid="trial-session-planning-report-term-selector"]',
          ).select(optionValue);
        });

      cy.get(
        '[data-testid="trial-session-planning-report-modal-term-error"]',
      ).should('not.exist');

      cy.get(
        '[data-testid="trial-session-planning-report-modal-year-error"]',
      ).should('not.exist');

      cy.get('[data-testid="trial-session-planning-report-year-selector"]')
        .find('option')
        .last()
        .then(option => {
          const optionValue = option.val()!;
          cy.get(
            '[data-testid="trial-session-planning-report-year-selector"]',
          ).select(optionValue);
        });

      cy.get(
        '[data-testid="trial-session-planning-report-modal-term-error"]',
      ).should('not.exist');

      cy.get(
        '[data-testid="trial-session-planning-report-modal-year-error"]',
      ).should('not.exist');

      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="cities-not-calendared-in-past-two-terms-table"]');

      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="trial-session-planning-btn"').click();

      cy.get('[data-testid="trial-session-planning-report-term-selector"]')
        .find('option')
        .last()
        .then(option => {
          const optionValue = option.val()!;
          cy.get(
            '[data-testid="trial-session-planning-report-term-selector"]',
          ).select(optionValue);
        });

      cy.get('[data-testid="trial-session-planning-report-year-selector"]')
        .find('option')
        .last()
        .then(option => {
          const optionValue = option.val()!;
          cy.get(
            '[data-testid="trial-session-planning-report-year-selector"]',
          ).select(optionValue);
        });

      cy.get(
        '[data-testid="trial-session-planning-report-modal-term-error"]',
      ).should('not.exist');

      cy.get(
        '[data-testid="trial-session-planning-report-modal-year-error"]',
      ).should('not.exist');

      cy.get('[data-testid="modal-button-confirm"]').click();
    });
    describe('Trial Location View', () => {
      afterEach(() => {
        cy.task('deleteAllFilesInFolder', 'cypress/downloads');
      });

      it('should render and export eligible cases for location', () => {
        const trialLocation = 'Birmingham, Alabama';
        const [trialCity, trialState] = trialLocation.split(', ');
        let tableRowCount: number;

        cy.get(
          `[data-testid="trial-location-link-${trialLocation}"] > a`,
        ).click();

        cy.get('[data-testid="trial-location-eligible-table"]').should(
          'be.visible',
        );

        cy.get('[data-testid="trial-location-eligible-table"]')
          .find('tbody tr')
          .then(rows => {
            tableRowCount = rows.length;
          });

        cy.get('[data-testId="eligible-cases-count"]')
          .invoke('text')
          .then(text => {
            const match = text.match(/Count:\s*(\d+)/);
            const displayedCount = parseInt(match![1], 10);
            expect(tableRowCount).to.equal(displayedCount);
          });

        cy.get('[data-testid="export-report"]').click();

        const today = formatNow(FORMATS.YEAR);
        const fileName = `Eligible Cases - ${trialCity}_${trialState}_${today}.csv`;
        cy.readFile(`cypress/downloads/${fileName}`, 'utf-8').then(
          fileContent => {
            const totalCasesInReport = fileContent
              .split('\n')
              .filter((str: string) => !!str).length;
            expect(totalCasesInReport).to.equal(tableRowCount + 1);
          },
        );
      });

      it('should return to Trial Session Planning Report', () => {
        cy.get('[data-testid="back-to-planning-report-button"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');
      });

      it('should render and export blocked cases for location', () => {
        const trialLocation = 'Anchorage, Alaska';
        const [trialCity, trialState] = trialLocation.split(', ');
        let tableRowCount: number;

        cy.get(
          `[data-testid="trial-location-link-${trialLocation}"] > a`,
        ).click();

        cy.get('[data-testid="blocked-cases-tab"]').click();

        cy.get('[data-testid="trial-location-blocked-table"]').should(
          'be.visible',
        );

        cy.get('[data-testid="trial-location-blocked-table"]')
          .find('tbody tr')
          .then(rows => {
            tableRowCount = rows.length;
          });

        cy.get('[data-testId="blocked-cases-count"]')
          .invoke('text')
          .then(text => {
            const match = text.match(/Count:\s*(\d+)/);
            const displayedCount = parseInt(match![1], 10);
            expect(tableRowCount).to.equal(displayedCount);
          });

        cy.get('[data-testid="export-report"]').click();

        const today = formatNow(FORMATS.YEAR);
        const fileName = `Blocked Cases Report - ${trialCity}_${trialState}_${today}.csv`;
        cy.readFile(`cypress/downloads/${fileName}`, 'utf-8').then(
          fileContent => {
            const totalCasesInReport = fileContent
              .split('\n')
              .filter((str: string) => !!str).length;
            expect(totalCasesInReport).to.equal(tableRowCount + 1);
          },
        );
      });
    });
  });
});
