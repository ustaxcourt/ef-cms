import { removePetitionerEmailAction } from '@web-client/presenter/actions/CaseAssociation/removePetitionerEmailAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';

export const removePetitionerEmailSequence = showProgressSequenceDecorator([
  clearModalAction,
  removePetitionerEmailAction,
  {
    error: [setAlertErrorAction, clearModalAction, clearModalStateAction],
    success: [setAlertSuccessAction, clearModalAction, clearModalStateAction],
  },
]) as unknown as () => void;
