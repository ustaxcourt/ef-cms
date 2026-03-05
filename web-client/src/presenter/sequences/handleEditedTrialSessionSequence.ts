import { shouldGenerateNoticeOfChangeTrialLocationAction } from '@web-client/presenter/actions/shouldGenerateNoticeOfChangeTrialLocationAction';
import { shouldGenerateNoticeOfChangeTrialStartDateAction } from '@web-client/presenter/actions/shouldGenerateNoticeOfChangeTrialStartDateAction';
import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';
import { setConfirmTrialSessionStartDateChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionStartDateChangeModalAction';
import { setTrialSessionLocationDifferencesAction } from '@web-client/presenter/actions/setTrialSessionLocationDifferencesAction';
import { setTrialSessionStartDateDifferencesAction } from '@web-client/presenter/actions/setTrialSessionStartDateDifferencesAction';
import { updateTrialSessionSequence } from '@web-client/presenter/sequences/updateTrialSessionSequence';

export const handleEditedTrialSessionSequence = [
  // shouldGenerateNoticeOfChangeTrialLocationAction,
  shouldGenerateNoticeOfChangeTrialStartDateAction,
  {
    unchanged: [updateTrialSessionSequence],
    updated: [
      // setTrialSessionLocationDifferencesAction,
      setTrialSessionStartDateDifferencesAction,
      // setConfirmTrialSessionLocationChangeModalAction,
      setConfirmTrialSessionStartDateChangeModalAction,
    ],
  },
] as unknown as () => void;
