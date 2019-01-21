import { state } from 'cerebral';
import { omit } from 'lodash';

export default ({ applicationContext, store, path, get }) => {
  const caseDetail = get(state.caseDetail);
  const { irsYear, irsMonth, irsDay, payGovYear, payGovMonth, payGovDay } = get(
    state.form,
  );

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${irsYear}-${irsMonth}-${irsDay}`,
      payGovDate: `${payGovYear}-${payGovMonth}-${payGovDay}`,
    },
    [
      'irsYear',
      'irsMonth',
      'irsDay',
      'payGovYear',
      'payGovMonth',
      'payGovDay',
      'trialCities',
    ],
  );

  if (irsYear && irsMonth && irsDay) {
    form.irsNoticeDate = form.irsNoticeDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
  } else {
    form.irsNoticeDate = null;
  }

  if (payGovYear && payGovMonth && payGovDay) {
    form.payGovDate = form.payGovDate
      .split('-')
      .map(segment => (segment = segment.padStart(2, '0')))
      .join('-');
  } else {
    form.payGovDate = null;
  }
  const errors = applicationContext.getUseCases().validateCaseDetail({
    caseDetail: { ...caseDetail, ...form },
    applicationContext,
  });

  store.set(state.caseDetailErrors, errors);

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
    });
  }
};
