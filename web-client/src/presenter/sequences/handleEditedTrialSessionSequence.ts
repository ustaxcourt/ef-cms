import { shouldGenerateNoticeOfChangeTrialLocationAction } from '@web-client/presenter/actions/shouldGenerateNoticeOfChangeTrialLocationAction';
import { shouldGenerateNoticeOfChangeTrialStartDateAction } from '@web-client/presenter/actions/shouldGenerateNoticeOfChangeTrialStartDateAction';
import { setConfirmTrialSessionLocationChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionLocationChangeModalAction';
import { setConfirmTrialSessionStartDateChangeModalAction } from '@web-client/presenter/actions/setConfirmTrialSessionStartDateChangeModalAction';
import { setTrialSessionLocationDifferencesAction } from '@web-client/presenter/actions/setTrialSessionLocationDifferencesAction';
import { setTrialSessionStartDateDifferencesAction } from '@web-client/presenter/actions/setTrialSessionStartDateDifferencesAction';
import { updateTrialSessionSequence } from '@web-client/presenter/sequences/updateTrialSessionSequence';
import { clearModalAction } from '@web-client/presenter/actions/clearModalAction';
import { state } from '@web-client/presenter/app.cerebral';
import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';

const updateLocation = [
  setTrialSessionLocationDifferencesAction,
  setConfirmTrialSessionLocationChangeModalAction,
];
const updateStartDate = [
  setTrialSessionStartDateDifferencesAction,
  setConfirmTrialSessionStartDateChangeModalAction,
];

const setPersistModalAction = ({ store }: ActionProps) => {
  console.log('set persist modal');
  store.set(state.trialSessionChangeModalState, {
    persist: true,
  });
};

const setDismissModalAction = ({ store }: ActionProps) => {
  store.set(state.trialSessionChangeModalState, {
    persist: false,
  });
};

export const handleEditedTrialSessionSequence = [
  // shouldGenerateNoticeOfChangeTrialLocationAction,
  shouldGenerateNoticeOfChangeTrialStartDateAction,
  {
    both: [
      setPersistModalAction,
      updateStartDate,
      clearModalAction,
      setDismissModalAction,
      // updateLocation,
    ],
    updateLocation,
    updateStartDate,
    unchanged: [updateTrialSessionSequence],
    // updated: [
    //   // setTrialSessionLocationDifferencesAction,
    //   setTrialSessionStartDateDifferencesAction,
    //   // setConfirmTrialSessionLocationChangeModalAction,
    //   setConfirmTrialSessionStartDateChangeModalAction,
    // ],
  },
] as unknown as () => void;
