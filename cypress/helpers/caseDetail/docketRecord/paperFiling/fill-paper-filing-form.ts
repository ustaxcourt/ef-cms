import { attachFile } from '../../../file/upload-file';
import { selectTypeaheadInput } from '../../../components/typeAhead/select-typeahead-input';

export type PaperFilingParty =
  'first' | 'petitioner' | 'respondent' | { other: string };

const selectPaperFilingParty = (party: PaperFilingParty): void => {
  if (party === 'first') {
    cy.get('[data-testid="filed-by-option"]').click();
    return;
  }

  if (party === 'petitioner') {
    cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
    return;
  }

  if (party === 'respondent') {
    cy.get('label[for="party-irs-practitioner"]').click();
    cy.get('#party-irs-practitioner').should('be.checked');
    return;
  }

  cy.get('label[for="has-other-filing-party"]').click();
  cy.get('#has-other-filing-party').should('be.checked');
  cy.get('#other-filing-party').type(party.other);
};

export function fillPaperFilingForm({
  dateReceived,
  documentType,
  filedBy,
  party,
}: {
  documentType: string;
  dateReceived: string;
  filedBy?: PaperFilingParty;
  party?: PaperFilingParty;
}): void {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-paper-filing"]').click();
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
  ).type(dateReceived);
  selectTypeaheadInput('primary-document-type-search', documentType);
  selectPaperFilingParty(party ?? filedBy ?? 'first');
  cy.get('[data-testid="objections-No"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();

  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#primaryDocumentFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
}
