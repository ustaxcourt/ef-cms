export function getPublicSiteUrl(): string {
  const publicUrl = Cypress.env('EFCMS_DOMAIN') || 'localhost:5678';

  return `http://${publicUrl}`;
}
