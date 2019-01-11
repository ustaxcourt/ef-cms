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

  const errors = applicationContext.getUseCases().validatePetition({
    petition: { ...petition, ...form },
    applicationContext,
  });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Fix the following errors to submit your form.',
        messages: Object.keys(errors).map(key => errors[key]),
      },
    });
  }
};
