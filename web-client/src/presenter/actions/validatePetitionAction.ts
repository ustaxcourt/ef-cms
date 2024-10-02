import { state } from '@web-client/presenter/app.cerebral';

export const validatePetitionAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const petition = get(state.petitionFormatted);

  const errors = applicationContext
    .getUseCases()
    .validatePetitionInteractor(applicationContext, {
      petition,
    });

  if (errors) {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }

  return path.success();
};
