import { attachFile } from '../../../../helpers/file/upload-file';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { fillPetitionerInformation } from '../fileAPetitionUpdated/petition-helper';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

// incremental-catalog.pdf holds its /Catalog at two generations; upload must reject it.
describe('uploading a PDF whose catalog is superseded by an incremental revision', () => {
  const FIXTURE = '../../helpers/file/incremental-catalog.pdf';
  const REJECTION_MESSAGE =
    'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.';
  const encoding = 'binary'; // This document's whole point is its byte layout

  describe('docket clerk uploading a court-issued document', () => {
    const docketNumber = '102-67'; // Any existing docket number works

    beforeEach(() => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
    });

    it('rejects the file with the unsupported-format message', () => {
      cy.intercept('POST', '/logError').as('logErrorRequest');

      attachFile({
        encoding,
        filePath: FIXTURE,
        selector: '[data-testid="primary-document-file"]',
      });
      cy.wait('@logErrorRequest');

      cy.get('[data-testid="file-upload-error-modal"]').contains(
        REJECTION_MESSAGE,
      );
      checkA11y();

      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid^="upload-file-success"]').should('not.exist');
    });

    it('accepts an equivalent document that carries no duplicate', () => {
      attachFile({
        encoding,
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
      });

      cy.get('[data-testid^="upload-file-success"]').should('exist');
      cy.get('[data-testid="file-upload-error-modal"]').should('not.exist');
    });
  });

  describe('petitioner uploading a petition', () => {
    it('rejects the file with the unsupported-format message', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();

      cy.get('[data-testid="upload-a-petition-label"]').click();
      attachFile({
        encoding,
        filePath: FIXTURE,
        selector: '#petition-file',
      });

      cy.get('[data-testid="file-upload-error-modal"]').contains(
        REJECTION_MESSAGE,
      );
    });
  });

  describe('private practitioner filing a document on a served case', () => {
    it('rejects the file with the unsupported-format message', () => {
      loginAsPrivatePractitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsPrivatePractitioner();
        cy.visit(`/case-detail/${docketNumber}`);
        cy.get('[data-testid="button-file-document"]').click();
        cy.get('[data-testid="ready-to-file"]').click();
        selectTypeaheadInput('complete-doc-document-type-search', 'Exhibit(s)');
        cy.get('[data-testid="submit-document"]').click();
        attachFile({
          encoding,
          filePath: FIXTURE,
          selector: '[data-testid="primary-document"]',
        });

        cy.get('[data-testid="file-upload-error-modal"]').contains(
          REJECTION_MESSAGE,
        );
      });
    });
  });
});
