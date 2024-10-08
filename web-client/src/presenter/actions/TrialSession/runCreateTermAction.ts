export const runCreateTermAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = props;

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
