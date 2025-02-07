import { shouldGenerateNoticeOfChangeTrialLocationAction } from '@web-client/presenter/actions/shouldGenerateNoticeOfChangeTrialLocationAction';
import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';
import { setTrialSessionLocationDifferencesAction } from '@web-client/presenter/actions/setTrialSessionLocationDifferencesAction';
import { updateTrialSessionSequence } from '@web-client/presenter/sequences/updateTrialSessionSequence';

export const handleEditedTrialSessionSequence = [
  shouldGenerateNoticeOfChangeTrialLocationAction,
  {
    unchanged: [updateTrialSessionSequence],
    updated: [
      setTrialSessionLocationDifferencesAction,
      setConfirmTrialSessionLocationChangeModalAction,
    ],
  },
] as unknown as () => void;
