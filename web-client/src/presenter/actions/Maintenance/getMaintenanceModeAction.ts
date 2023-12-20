export const getMaintenanceModeAction = async ({
  applicationContext,
}: ActionProps): Promise<{ maintenanceMode: boolean }> => {
  const maintenanceMode = await applicationContext
    .getUseCases()
    .getMaintenanceModeInteractor(applicationContext);

  return { maintenanceMode };
};
