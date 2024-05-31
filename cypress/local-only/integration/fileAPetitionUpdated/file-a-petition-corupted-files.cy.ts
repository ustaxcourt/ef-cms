import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';

describe('File a petition - Corrupted Files', () => {
  const CORRUPTED_FILE = '../../helpers/file/corrupt-pdf.pdf';
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  it('should display modal when a corrupted file is being used for petition', () => {
    fillPetitionFileInformation(CORRUPTED_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should display modal when a corrupted file is being used for IRS notice', () => {
    fillPetitionFileInformation(VALID_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(CORRUPTED_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should display modal when a corrupted file is being used for STIN', () => {
    fillPetitionFileInformation(VALID_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(CORRUPTED_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should successfully file a petition when all PDF being uploaded are valid', () => {
    fillPetitionFileInformation(VALID_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();

    cy.get('[data-testid="success-alert"]').contains(
      'Your case has been assigned docket number',
    );
  });
});
