import { state } from 'cerebral';
import { omit } from 'lodash';

export default ({ applicationContext, path, get }) => {
  const caseDetail = get(state.caseDetail);

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${get(state.form.year)}-${get(state.form.month)}-${get(
        state.form.day,
      )}`,
    },
    ['year', 'month', 'day', 'trialCities'],
  );

  form.irsNoticeDate = form.irsNoticeDate
    .split('-')
    .map(segment => (segment = segment.padStart(2, '0')))
    .join('-');

  const errors = applicationContext.getUseCases().validateCaseDetail({
    caseDetail: { ...caseDetail, ...form },
    applicationContext,
  });

  console.log(errors)

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
