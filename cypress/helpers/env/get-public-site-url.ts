export function getPublicSiteUrl(): string {
  if (Cypress.env('ENV') === 'local') {
    return 'http://localhost:5678';
  } else {
    return `https://${Cypress.env('DEPLOYING_COLOR')}.${Cypress.env('EFCMS_DOMAIN')}`;
  }
}
