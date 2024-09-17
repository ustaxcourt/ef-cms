export const logErrorAction = ({ applicationContext, props }: ActionProps) => {
  if (props.errorToLog) {
    applicationContext.getUseCases().logErrorInteractor(applicationContext, {
      error: props.errorToLog,
    });
  }
};
