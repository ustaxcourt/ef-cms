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

    fillPetitionFileInformation(CORRUPTED_FILE);

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should display modal when a corrupted file is being used for IRS notice', () => {
    fillPetitionerInformation();

    fillPetitionFileInformation(VALID_FILE);

    fillIrsNoticeInformation(CORRUPTED_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should display modal when a corrupted file is being used for STIN', () => {
    fillPetitionerInformation();

    fillPetitionFileInformation(VALID_FILE);

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(CORRUPTED_FILE);

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
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
