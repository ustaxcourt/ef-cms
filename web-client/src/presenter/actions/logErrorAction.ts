export const logErrorAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  if (props.errorToLog) {
    await applicationContext
      .getUseCases()
      .logErrorInteractor(applicationContext, {
        error: props.errorToLog,
      });
  }
};
