import { parseDateToMonthDayYear } from '../CaseDeadline/parseDateToMonthDayYear';
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
  const startDateValues = parseDateToMonthDayYear({
    applicationContext,
    dateString: props.trialSession.startDate,
  });
  const estimatedEndDateValues = parseDateToMonthDayYear({
    applicationContext,
    dateString: props.trialSession.estimatedEndDate,
  });

  store.set(state.form, {
    ...props.trialSession,
    ...{
      startDateDay: startDateValues.day,
      startDateMonth: startDateValues.month,
      startDateYear: startDateValues.year,
    },
    ...{
      estimatedEndDateDay: estimatedEndDateValues.day,
      estimatedEndDateMonth: estimatedEndDateValues.month,
      estimatedEndDateYear: estimatedEndDateValues.year,
    },
    judgeId: props.trialSession.judge && props.trialSession.judge.userId,
    trialClerkId:
      props.trialSession.trialClerk && props.trialSession.trialClerk.userId,
  });
};
