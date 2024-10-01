import { state } from '@web-client/presenter/app.cerebral';

export const runCreateTermAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  try {
    const { bufferArray, message } = await applicationContext
      .getUseCases()
      .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
        termEndDate,
        termStartDate,
      });

    if (bufferArray?.data) {
      return path.success({
        alertSuccess: {
          message,
          title: 'Successfully generated suggested term.',
        },
        bufferArray,
        termName,
      });
    } else {
      return path.error({
        alertError: {
          message,
          title: 'Create term error.',
        },
      });
    }
  } catch (error: any) {
    return path.error({
      alertError: {
        message: error.message,
        title: 'Create term error.',
      },
    });
  }
};
