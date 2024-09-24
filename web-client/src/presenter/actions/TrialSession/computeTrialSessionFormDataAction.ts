import { SESSION_TERMS_BY_MONTH } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const computeTermAndUpdateState = (
  { startDate },
  store,
  applicationContext,
) => {
  const date = applicationContext.getUtilities().deconstructDate(startDate);

  if (date?.month && date?.year) {
    let term;

    const monthAsNumber = +date.month;

    if (SESSION_TERMS_BY_MONTH.winter.includes(monthAsNumber)) {
      term = 'Winter';
    } else if (SESSION_TERMS_BY_MONTH.spring.includes(monthAsNumber)) {
      term = 'Spring';
    } else if (SESSION_TERMS_BY_MONTH.summer.includes(monthAsNumber)) {
      term = 'Summer';
    } else if (SESSION_TERMS_BY_MONTH.fall.includes(monthAsNumber)) {
      term = 'Fall';
    }

    store.set(state.form.term, term);
    store.set(state.form.termYear, date.year);
  }
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

export const computeTrialSessionFormDataAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{
  key: string;
  value: {
    userId: string;
    section: string;
  };
}>) => {
  const form = get(state.form);

  computeTermAndUpdateState(
    {
      startDate: form.startDate,
    },
    store,
    applicationContext,
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
    const selectedJudge = props.value;

    store.set(state.form.judgeId, selectedJudge.userId);
    store.set(state.form.judge, selectedJudge);

    const JUDGES_CHAMBERS = get(state.judgesChambers);

    const judge = JUDGES_CHAMBERS.find(
      ({ section }) => section === selectedJudge.section,
    );

    if (!judge) {
      throw new Error(
        'could not find an expected chambers section associated with the selected judge',
      );
    }

    store.set(state.form.chambersPhoneNumber, judge.phoneNumber);
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
