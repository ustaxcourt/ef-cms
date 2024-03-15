import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';

export const goToCreatePetitionerAccountSequence = [
  clearFormAction,
  clearAlertsAction,
  setupCurrentPageAction('CreatePetitionerAccount'),
] as unknown as () => void;
