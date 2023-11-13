import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToCreatePetitionerAccountSequence = [
  clearFormAction,
  clearErrorAlertsAction,
  setupCurrentPageAction('CreatePetitionerAccount'),
] as unknown as () => void;
