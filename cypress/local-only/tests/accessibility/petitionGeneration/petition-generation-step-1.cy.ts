import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 1', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  describe('Myself', () => {
    it('should be free of a11y issues with domestic address', () => {
      cy.get('[data-testid="filing-type-0"').click();
      checkA11y();
    });

    it('should be free of a11y issues with international address', () => {
      cy.get('[data-testid="filing-type-0"').click();
      cy.get('[data-testid="international-country-btn"]').click();
      checkA11y();
    });

    it('should be free of a11y issues with language fields filled', () => {
      cy.get('[data-testid="filing-type-0"').click();
      cy.get('[data-testid="contact-primary-preferred-language"]').type(
        'Spanish',
      );
      cy.get('[data-testid="contact-primary-preferred-language"]').blur();
      cy.get(
        '[data-testid="contact-primary-preferred-communication-method"]',
      ).type('ASL');
      cy.get(
        '[data-testid="contact-primary-preferred-communication-method"]',
      ).blur();
      checkA11y();
    });
  });
  describe('Myself and my spouse', () => {
    it('should be free of a11y issues when spouse is deceased', () => {
      cy.get('[data-testid="filing-type-1"').click();
      cy.get('[data-testid="is-spouse-deceased-0"]').click();
      checkA11y();
    });

    it('should be free of a11y issues when spouse is not deceased', () => {
      cy.get('[data-testid="filing-type-1"').click();
      cy.get('[data-testid="is-spouse-deceased-1"]').click();
      cy.get('[data-testid="have-spouse-consent-label"').click();
      checkA11y();
    });

    it('should be free of a11y issues with language fields filled', () => {
      cy.get('[data-testid="filing-type-1"').click();
      cy.get('[data-testid="is-spouse-deceased-1"]').click();
      cy.get('[data-testid="have-spouse-consent-label"').click();
      cy.get('[data-testid="contact-primary-preferred-language"]').type(
        'Spanish',
      );
      cy.get('[data-testid="contact-primary-preferred-language"]').blur();
      cy.get(
        '[data-testid="contact-primary-preferred-communication-method"]',
      ).type('ASL');
      cy.get(
        '[data-testid="contact-primary-preferred-communication-method"]',
      ).blur();
      cy.get('[data-testid="contact-secondary-preferred-language"]').type(
        'French',
      );
      cy.get('[data-testid="contact-secondary-preferred-language"]').blur();
      cy.get(
        '[data-testid="contact-secondary-preferred-communication-method"]',
      ).type('TTY');
      cy.get(
        '[data-testid="contact-secondary-preferred-communication-method"]',
      ).blur();
      checkA11y();
    });
  });
  describe('Business', () => {
    it('Corporation: should be free of a11y issues', () => {
      cy.get('[data-testid="filing-type-2"').click();
      cy.get('.business-type-radio-option').eq(0).click();
      checkA11y();
    });

    it('Partnership (as the Tax Matters Partner): should be free of a11y issues', () => {
      cy.get('[data-testid="filing-type-2"').click();
      cy.get('.business-type-radio-option').eq(1).click();
      checkA11y();
    });

    it('Partnership (as a partner other than Tax Matters Partner): should be free of a11y issues', () => {
      cy.get('[data-testid="filing-type-2"').click();
      cy.get('.business-type-radio-option').eq(2).click();
      checkA11y();
    });

    it('Partnership (as a partnership representative under BBA): should be free of a11y issues', () => {
      cy.get('[data-testid="filing-type-2"').click();
      cy.get('.business-type-radio-option').eq(3).click();
      checkA11y();
    });
  });
  describe('Other', () => {
    describe('An estate or trust', () => {
      it('Estate with an executor/personal representative/fiduciary/etc.: should be free of a11y issues: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-0"]').click();
        cy.get('[data-testid="estate-type-radio-option-0"]').click();
        checkA11y();
      });

      it('Estate without an executor/personal representative/fiduciary/etc.: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-0"]').click();
        cy.get('[data-testid="estate-type-radio-option-1"]').click();
        checkA11y();
      });

      it('Trust: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-0"]').click();
        cy.get('[data-testid="estate-type-radio-option-2"]').click();
        checkA11y();
      });
    });

    describe('A minor or legally incompetent person', () => {
      it('Conservator: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-1"]').click();
        cy.get('[data-testid="minor-incompetent-type-radio-option-0"]').click();
        checkA11y();
      });

      it('Guardian: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-1"]').click();
        cy.get('[data-testid="minor-incompetent-type-radio-option-1"]').click();
        checkA11y();
      });

      it('Custodian: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-1"]').click();
        cy.get('[data-testid="minor-incompetent-type-radio-option-2"]').click();
        checkA11y();
      });

      it('Next friend for a minor (without a guardian, conservator, or other like fiduciary): should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-1"]').click();
        cy.get('[data-testid="minor-incompetent-type-radio-option-3"]').click();
        checkA11y();
      });

      it('Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary): should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-1"]').click();
        cy.get('[data-testid="minor-incompetent-type-radio-option-4"]').click();
        checkA11y();
      });
    });

    describe('Donor', () => {
      it('Donor: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-2"]').click();
        checkA11y();
      });
    });

    describe('Transferee', () => {
      it('Transferee: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-3"]').click();
        checkA11y();
      });
    });

    describe('Deceased Spouse', () => {
      it('Deceased Spouse: should be free of a11y issues', () => {
        cy.get('[data-testid="filing-type-3"').click();
        cy.get('[data-testid="other-type-radio-option-4"]').click();
        checkA11y();
      });
    });
  });
});
