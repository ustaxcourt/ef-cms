import { attachFile } from '../../../../helpers/file/upload-file';
import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Corrupted Files', () => {
  const CORRUPTED_FILE = '../../helpers/file/corrupt-pdf.pdf';
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  it('should display modal when a corrupted file is being used for petition', () => {
    fillPetitionerInformation();

    cy.get('[data-testid="upload-a-petition-label"').click();
    attachFile({
      filePath: CORRUPTED_FILE,
      selector: '#petition-file',
    });
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again',
    );
  });

  it('should display modal when a corrupted file is being used for IRS notice', () => {
    fillPetitionerInformation();

    fillPetitionFileInformation(VALID_FILE);

    cy.get('[data-testid="irs-notice-Yes"]').click();
    attachFile({
      filePath: CORRUPTED_FILE,
      selector: '[data-testid="irs-notice-upload-0"]',
    });
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.',
    );
  });

  it('should display modal when a corrupted file is being used for STIN', () => {
    fillPetitionerInformation();

    fillPetitionFileInformation(VALID_FILE);

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    attachFile({
      filePath: CORRUPTED_FILE,
      selector: '[data-testid="stin-file"]',
    });

    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.',
    );
  });

  it('should successfully file a petition when all PDF being uploaded are valid', () => {
    fillPetitionerInformation();

    fillPetitionFileInformation(VALID_FILE);

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();

    cy.get('[data-testid="success-alert"]').contains(
      'Your case has been assigned docket number',
    );
  });
});
