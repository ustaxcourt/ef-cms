import { state } from 'cerebral';

export const computeTermAndUpdateState = ({ month, year }, store) => {
  const selectedMonth = +month;
  let term, termYear;

  if (selectedMonth && year) {
    termYear = year;
    const termsByMonth = {
      fall: [9, 10, 11, 12],
      spring: [4, 5, 6],
      summer: [7, 8],
      winter: [1, 2, 3],
    };

    if (termsByMonth.winter.includes(selectedMonth)) {
      term = 'Winter';
    } else if (termsByMonth.spring.includes(selectedMonth)) {
      term = 'Spring';
    } else if (termsByMonth.summer.includes(selectedMonth)) {
      term = 'Summer';
    } else if (termsByMonth.fall.includes(selectedMonth)) {
      term = 'Fall';
    }
  }
  store.set(state.form.term, term);
  store.set(state.form.termYear, termYear);
};

export const compute24HrTimeAndUpdateState = (
  { extension, hours, minutes },
  store,
) => {
  if (!hours && !minutes) return undefined;
  const TIME_INVALID = '99:99'; // force time validation error

  const VALID_HOUR_RE = /^((0?[1-9])|([1][0-2]))$/; // 1-9, 01-09, 10-12
  const VALID_MINUTE_RE = /^([0-5][0-9])$/; // 00-59

  if (
    !VALID_HOUR_RE.test(hours) ||
    !VALID_MINUTE_RE.test(minutes) ||
    !['am', 'pm'].includes(extension)
  ) {
    store.set(state.form.startTime, TIME_INVALID);
    return;
  }

  if (extension === 'pm') {
    if (+hours <= 11) {
      hours = `${+hours + 12}`;
    }
  } else {
    if (+hours === 12) {
      hours = '00';
    } else {
      hours = hours.padStart(2, '0');
    }
  }

  store.set(state.form.startTime, `${hours}:${minutes}`);
};

/**
 * computes the trial session form data based on user input
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store function
 */
export const computeTrialSessionFormDataAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const form = get(state.form);

  computeTermAndUpdateState(
    {
      month: form.startDateMonth,
      year: form.startDateYear,
    },
    store,
  );

  compute24HrTimeAndUpdateState(
    {
      extension: form.startTimeExtension,
      hours: form.startTimeHours,
      minutes: form.startTimeMinutes,
    },
    store,
  );

  if (props.key === 'judgeId') {
    store.set(state.form.judgeId, props.value.userId);
    store.set(state.form.judge, props.value);
  }

  if (props.key === 'trialClerkId') {
    if (props.value) {
      store.set(state.form.trialClerkId, props.value.userId);
      if (props.value.userId !== 'Other') {
        store.set(state.form.trialClerk, props.value);
        store.unset(state.form.alternateTrialClerkName);
      }
    } else {
      store.unset(state.form.alternateTrialClerkName);
      store.unset(state.form.trialClerk);
      store.unset(state.form.trialClerkId);
    }
  }
};
