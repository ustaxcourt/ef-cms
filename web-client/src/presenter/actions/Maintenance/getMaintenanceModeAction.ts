export const getMaintenanceModeAction = async ({
  applicationContext,
}: ActionProps): Promise<{
  maintenanceMode: boolean;
  readOnlyMode: boolean;
}> => {
  return await applicationContext
    .getUseCases()
    .getMaintenanceModeInteractor(applicationContext);
};
