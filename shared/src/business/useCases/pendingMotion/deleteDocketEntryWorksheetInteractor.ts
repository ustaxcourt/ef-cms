export const deleteDocketEntryWorksheetInteractor = async (
  applicationContext: IApplicationContext,
  docketEntryId: string,
): Promise<void> => {
  // TODO: Determine who can delete Docket Entry Worksheet
  // const authorizedUser = applicationContext.getCurrentUser();
  // if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
  // throw new UnauthorizedError('Unauthorized');
  // }

  await applicationContext
    .getPersistenceGateway()
    .deleteDocketEntryWorksheetRecord({
      applicationContext,
      docketEntryId,
    });
};
