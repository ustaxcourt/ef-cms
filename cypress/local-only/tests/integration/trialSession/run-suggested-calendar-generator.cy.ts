import {
  FORMATS,
  createISODateString,
  getBusinessDateInFuture,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { loginAsPetitionsClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('Run the suggested trial session calendar generator', () => {
  const tomorrow = getBusinessDateInFuture({
    numberOfDays: 1,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(),
  });
  const oneMonthFromNow = getBusinessDateInFuture({
    numberOfDays: 1,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(),
  });

  it('should run the suggested trial session calendar generator', () => {
    loginAsPetitionsClerk1();
    cy.visit('/trial-sessions');
    cy.get('[data-testId="open-create-term-modal-button"]').click();
    cy.get('[data-testid="term-name-field"]').type('Test Term Name');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="termStartDate-date-start-input"]',
    ).type(tomorrow);
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="termEndDate-date-end-input"]',
    ).type(oneMonthFromNow);
    cy.get('[data-testid="modal-button-confirm"]').click();
  });
});
