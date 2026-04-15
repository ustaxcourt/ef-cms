export const getMaintenanceModeAction = async ({
  applicationContext,
}: ActionProps): Promise<{
  maintenanceMode: boolean;
  readOnlyMode: boolean;
}> => {
  const result = await applicationContext
    .getUseCases()
    .getMaintenanceModeInteractor(applicationContext);

  const maintenanceMode =
    typeof result === 'boolean' ? result : result.maintenanceMode;
  const readOnlyMode =
    typeof result === 'boolean' ? false : result.readOnlyMode;

  return { maintenanceMode, readOnlyMode };
};
