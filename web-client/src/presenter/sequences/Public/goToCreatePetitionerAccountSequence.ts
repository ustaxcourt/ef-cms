import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToCreatePetitionerAccountSequence = [
  clearErrorAlertsAction,
  setupCurrentPageAction('CreatePetitionerAccount'),
];
