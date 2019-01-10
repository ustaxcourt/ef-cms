import { state } from 'cerebral';

export default ({ applicationContext, path, get }) => {
  const { petitionFile } = get(state.petition);
  const form = get(state.form);

  const errors = applicationContext.getUseCases().validatePetitionForm({
    petitionForm: {
      ...form,
      petitionFile,
    },
  });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Fix the follow errors to submit your form.',
        messages: Object.keys(errors).map(key => errors[key]),
      },
    });
  }
};
