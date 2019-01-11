import { state } from 'cerebral';
import { omit } from 'lodash';

export default ({ applicationContext, path, get }) => {
  const petition = get(state.petition);
  const form = omit(
    {
      ...get(state.form),
      irsNoticeDate: get(state.startCaseHelper.irsNoticeDate),
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
