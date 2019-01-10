import { state } from 'cerebral';

export default ({ applicationContext, path, get }) => {
  const petition = get(state.petition);

  const errors = applicationContext.getUseCases().validatePetition({
    petition,
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
