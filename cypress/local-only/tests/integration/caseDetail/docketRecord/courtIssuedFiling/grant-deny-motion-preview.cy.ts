import { MOTION_DISPOSITIONS } from '@shared/business/entities/EntityConstants';
import { loginAsColvin } from 'cypress/helpers/authentication/login-as-helpers';
import {
  createGrantDenyMotionCase,
  grantDenyMotionFormattedToday,
  GRANT_DENY_MOTION_TYPE,
  openGrantDenyMotionFromDocketRecord,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';

describe('Grant/Deny Motion preview (T13534, T13535)', () => {
  it('should preview preamble only when no disposition is selected (T13534)', () => {
    createGrantDenyMotionCase().then(({ docketNumber }) => {
      loginAsColvin();
      cy.visit(`/case-detail/${docketNumber}`);
      openGrantDenyMotionFromDocketRecord();

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="preview-pdf-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request }) => {
        const html: string = request.body.contentHtml;
        expect(html).to.include(
          `On ${grantDenyMotionFormattedToday}, petitioner filed a ${GRANT_DENY_MOTION_TYPE}`,
        );
        expect(html).to.include('For cause, it is');
        expect(html).not.to.include('ORDERED that');
      });
    });
  });

  [
    { disposition: MOTION_DISPOSITIONS.GRANTED, phrase: 'is granted' },
    { disposition: MOTION_DISPOSITIONS.DENIED, phrase: 'is denied' },
  ].forEach(({ disposition, phrase }) => {
    it(`should preview an order with disposition ${disposition}`, () => {
      createGrantDenyMotionCase().then(({ docketNumber }) => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
        openGrantDenyMotionFromDocketRecord();

        cy.get(`[data-testid="motion-disposition-${disposition}"]`).click({
          force: true,
        });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include(
            `ORDERED that petitioner's ${GRANT_DENY_MOTION_TYPE} ${phrase}.`,
          );
        });
      });
    });
  });

  it('should omit blank additional-order-text rows from preview', () => {
    createGrantDenyMotionCase().then(({ docketNumber }) => {
      loginAsColvin();
      cy.visit(`/case-detail/${docketNumber}`);
      openGrantDenyMotionFromDocketRecord();

      cy.get('[data-testid="motion-disposition-GRANTED"]').click({
        force: true,
      });
      cy.get('[data-testid="add-additional-order-text"]').click();
      cy.get('[data-testid="additional-order-text-0"]').type('first clause');
      cy.get('[data-testid="add-additional-order-text"]').click();

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="preview-pdf-button"]').click();

      cy.wait('@courtIssuedOrder').then(({ request }) => {
        const html: string = request.body.contentHtml;
        expect(html).to.include('ORDERED that first clause.');
        expect(html).not.to.include('ORDERED that .');
      });
    });
  });
});
