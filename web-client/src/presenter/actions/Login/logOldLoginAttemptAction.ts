export const logOldLoginAttemptAction = async ({
  applicationContext,
}: ActionProps) => {
  await applicationContext
    .getUseCases()
    .logOldLoginAttemptInteractor(applicationContext);
};
