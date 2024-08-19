import { state } from '@web-client/presenter/app.cerebral';

export const updatedValidatePetitionAction = ({
  applicationContext,
  get,
  path,
}: ActionProps<{}, IApplicationContext>) => {
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
