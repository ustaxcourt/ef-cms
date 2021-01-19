import { parseDateToMonthDayYearAction } from '../CaseDeadline/parseDateToMonthDayYearAction';
import { state } from 'cerebral';

/**
 * sets the state.form to the props.trialSession
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.trialSession
 * @param {object} providers.store the cerebral store used for setting the state.trialSession
 */
export const setTrialSessionDetailsOnFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  store.set(state.form, {
    ...props.trialSession,
    ...parseDateToMonthDayYearAction({
      applicationContext,
      dateString: props.trialSession.startDate,
    }),
    judgeId: props.trialSession.judge && props.trialSession.judge.userId,
    trialClerkId:
      props.trialSession.trialClerk && props.trialSession.trialClerk.userId,
  });
};
