import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';
import { setConfirmTrialSessionStartDateChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionStartDateChangeModalAction';
import { setTrialSessionLocationDifferencesAction } from '@web-client/presenter/actions/setTrialSessionLocationDifferencesAction';
import { setTrialSessionStartDateDifferencesAction } from '@web-client/presenter/actions/setTrialSessionStartDateDifferencesAction';
import { updateTrialSessionSequence } from '@web-client/presenter/sequences/updateTrialSessionSequence';
import { determineNoticesOfTrialChangesToGenerateAction } from '@web-client/presenter/actions/determineNoticesOfTrialChangesToGenerateAction';
import { parallel } from 'cerebral';

const locationSequence = [
  setTrialSessionLocationDifferencesAction,
  setConfirmTrialSessionLocationChangeModalAction,
];
const startDateSequence = [
  setTrialSessionStartDateDifferencesAction,
  setConfirmTrialSessionStartDateChangeModalAction,
];

export const handleEditedTrialSessionSequence = [
  determineNoticesOfTrialChangesToGenerateAction,
  {
    both: [
      parallel([
        startDateSequence,
        [setTrialSessionLocationDifferencesAction],
      ])
    ],
    location: locationSequence,
    startDate: startDateSequence,
    unchanged: [updateTrialSessionSequence],
  },
] as unknown as () => void;
