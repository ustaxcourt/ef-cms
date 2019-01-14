import { state } from 'cerebral';
import { omit } from 'lodash';

export default ({ applicationContext, path, get }) => {
  const petition = get(state.petition);

  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: `${get(state.form.year)}-${get(state.form.month)}-${get(
        state.form.day,
      )}`,
    },
    ['year', 'month', 'day'],
  );

  form.irsNoticeDate = form.irsNoticeDate
    .split('-')
    .map(segment => (segment = segment.padStart(2, '0')))
    .join('-');

  const errors = applicationContext.getUseCases().validatePetition({
    petition: { ...petition, ...form },
    applicationContext,
  });

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
