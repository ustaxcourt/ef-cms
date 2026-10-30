import { downloadAndParsePdf } from '../../local-only/support/helpers';
import { getCypressEnv } from '../env/cypressEnvironment';
import { MotionVisibilityPublicDocketEntry } from './motion-visibility-types';

export function verifyStrickenDocketEntry(docketEntryId: string): void {
  cy.get(`[data-testid="${docketEntryId}"]`)
    .find('.stricken-docket-record')
    .should('exist');
  cy.get(`[data-testid="${docketEntryId}"]`)
    .contains('(STRICKEN)')
    .should('exist');
}

export function verifyDocumentRowHasNoDownloadLink(
  docketEntryId: string,
): void {
  cy.get(`[data-testid="${docketEntryId}"]`)
    .find('[data-testid^="document-download-link-"]')
    .should('not.exist');
}

export function verifyPublicSealedEntryShowsLockWithoutLink(
  docketNumber: string,
  docketEntryIndex: number,
): void {
  const { publicSiteUrl } = getCypressEnv();

  cy.origin(
    publicSiteUrl,
    {
      args: {
        docketNumber,
        publicSiteUrl,
        docketEntryIndex,
      },
    },
    ({ docketNumber: dn, publicSiteUrl: url, docketEntryIndex: index }) => {
      cy.visit(`${url}/case-detail/${dn}`);
      cy.get(`[data-testid="public-docket-record-no-${index}"]`).then(row => {
        cy.wrap(row).find('.icon-sealed').should('exist');
        cy.wrap(row)
          .find('[data-testid="Filing-and-Proceedings-link-to-docket-entry"]')
          .should('not.exist');
      });
    },
  );
}

export function verifyMotionNotViewableOnPublicSite(
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void {
  verifyDocumentCannotBeViewedPublic(docketNumber, motion.index);
}

export function verifyMotionViewableOnPublicSite(
  docketNumber: string,
  motion: MotionVisibilityPublicDocketEntry,
): void {
  verifyDocumentCanBeViewedPublic(docketNumber, motion.index);
}

export function verifyDocumentCanBeViewed(docketEntryId: string): void {
  cy.get(`[data-testid="${docketEntryId}"]`).then(row => {
    cy.wrap(row)
      .find('[data-testid^="document-download-link-"]')
      .should('exist');
    downloadAndParsePdf({
      element: cy.wrap(row).find('[data-testid^="document-download-link-"]'),
    });
  });
}

export function verifyDocumentCannotBeViewed(
  docketNumber: string,
  docketEntryId: string,
): void {
  const { privateApiUrl } = getCypressEnv();

  cy.get(`[data-testid="${docketEntryId}"]`).then(row => {
    cy.wrap(row)
      .find('[data-testid^="document-download-link-"]')
      .should('not.exist');
    cy.wrap(row)
      .find('[data-testid^="docket-entry-filingsAndProceedings-"]')
      .should('exist');
    cy.request({
      url: `${privateApiUrl}/case-documents/${docketNumber}/${docketEntryId}/document-download-url`,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(403);
    });
  });
}

export function verifyDocumentCanBeViewedPublic(
  docketNumber: string,
  docketEntryIndex: number,
): void {
  const { publicSiteUrl } = getCypressEnv();

  cy.origin(
    publicSiteUrl,
    {
      args: {
        docketNumber,
        publicSiteUrl,
        docketEntryIndex,
      },
    },
    ({ docketNumber: dn, publicSiteUrl: url, docketEntryIndex: index }) => {
      cy.intercept('GET', '**/public-api/**/public-document-download-url').as(
        'publicDownload',
      );

      cy.visit(`${url}/case-detail/${dn}`);

      cy.window().then(win => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get(`[data-testid="public-docket-record-no-${index}"]`)
        .find('[data-testid="Filing-and-Proceedings-link-to-docket-entry"]')
        .should('exist')
        .click();

      cy.wait('@publicDownload').then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
      });
    },
  );
}

export function verifyDocumentCannotBeViewedPublic(
  docketNumber: string,
  docketEntryIndex: number,
): void {
  const { publicSiteUrl } = getCypressEnv();

  cy.origin(
    publicSiteUrl,
    {
      args: {
        docketNumber,
        publicSiteUrl,
        docketEntryIndex,
      },
    },
    ({ docketNumber: dn, publicSiteUrl: url, docketEntryIndex: index }) => {
      cy.visit(`${url}/case-detail/${dn}`);
      cy.get(`[data-testid="public-docket-record-no-${index}"]`).then(row => {
        cy.wrap(row)
          .find('[data-testid="Filing-and-Proceedings-link-to-docket-entry"]')
          .should('not.exist');
        cy.wrap(row)
          .find('[data-label="Filings and Proceedings"]')
          .should('exist');
      });
    },
  );
}

export function verifyPublicDownloadForbidden(
  docketNumber: string,
  docketEntryId: string,
): void {
  const { publicApiUrl } = getCypressEnv();
  cy.request({
    url: `${publicApiUrl}/public-api/${docketNumber}/${docketEntryId}/public-document-download-url`,
    failOnStatusCode: false,
  }).then(response => {
    expect(response.status).to.eq(403);
  });
}
