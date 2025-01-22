import { hasTrialSessionLocationChangedAction } from '@web-client/presenter/actions/hasTrialSessionLocationChangedAction';
import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';
import { setTrialSessionLocationDifferencesAction } from '@web-client/presenter/actions/setTrialSessionLocationDifferencesAction';
import { updateTrialSessionSequence } from '@web-client/presenter/sequences/updateTrialSessionSequence';

export const displayTrialSessionLocationChangeModalSequence = [
  hasTrialSessionLocationChangedAction,
  {
    unchanged: [updateTrialSessionSequence],
    updated: [
      setTrialSessionLocationDifferencesAction,
      setConfirmTrialSessionLocationChangeModalAction,
    ],
  },
] as unknown as () => void;
