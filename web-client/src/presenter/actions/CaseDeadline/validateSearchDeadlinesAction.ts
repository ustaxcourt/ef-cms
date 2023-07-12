import { state } from '@web-client/presenter/app.cerebral';

export const validateSearchDeadlinesAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const startDate = get(state.screenMetadata.filterStartDateState);
  const endDate = get(state.screenMetadata.filterEndDateState);

  const errors = applicationContext
    .getUseCases()
    .validateSearchDeadlinesInteractor({
      deadlineSearch: {
        endDate,
        startDate,
      },
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
