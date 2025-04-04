import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const removePetitionerEmailSequence = showProgressSequenceDecorator([
  clearModalAction,
  () => {
    return {
      alertSuccess: { message: 'Changes saved.' },
    };
  },
  setAlertSuccessAction,
]) as unknown as () => void;
