import { loginAsColvin } from "cypress/helpers/authentication/login-as-helpers"


describe('trials session working copies filtering', () => {
	beforeEach(() => {
		loginAsColvin();
		cy.get('[data-testid="trial-session-link"]').click();
		cy.get('[data-testid="trial-location-link-959c4338-0fac-42eb-b0eb-d53b8d0195cc"]').click();

		// Reset all filters
		cy.get('[data-testid^="trial-session-working-copy-filter-"]').each(($filterDiv) => {
			cy.wrap($filterDiv).find('input[type="checkbox"]').then(($checkbox) => {
				if (!$checkbox.prop('checked')) {
					cy.wrap($filterDiv).find('label').click();
				}
			});
		});
		// Reset all trial statuses
		cy.get('[data-testid^="trialSessionWorkingCopy-"]').each(($el) => {
			cy.wrap($el).select('statusUnassigned');
		});
		
		cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned"]').should('contain', '(3)');
	});
	it('should have all docket numbers set to statusUnassigned on initial load', () => {
		cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned').find('span').invoke('text').then((text) => {
			expect(text).to.equal('(3)');
		});
	});
	it('clicking the checkbox on the filter should not change the count', () => {
		cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned').click();
		cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned').find('span').invoke('text').then((text) => {
			expect(text).to.equal('(3)');
		});
	});
	it('should change counts if a trial status is changed', () => {
		cy.get('[data-testid="trialSessionWorkingCopy-108-19"]').select('basisReached');
		cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned').find('span').invoke('text').then((text) => {
			expect(text).to.equal('(2)');
		});
		cy.get('[data-testid="trial-session-working-copy-filter-basisReached').find('span').invoke('text').then((text) => {
			expect(text).to.equal('(1)');
		});
	});
	it('should add back to statusUnassigned if trial status is changed back to unassigned', () => {
		cy.get('[data-testid="trialSessionWorkingCopy-108-19"]').select('statusUnassigned');
		cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned').find('span').invoke('text').then((text) => {
			expect(text).to.equal('(3)');
		});
		cy.get('[data-testid="trial-session-working-copy-filter-basisReached').find('span').should('not.exist');
	});
})