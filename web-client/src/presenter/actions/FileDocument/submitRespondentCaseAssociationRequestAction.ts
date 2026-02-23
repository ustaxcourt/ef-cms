import { state } from '@web-client/presenter/app.cerebral';

export const submitRespondentCaseAssociationRequestAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<void> => {
  const { docketNumber } = get(state.caseDetail);

  const user = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.irsPractitioner) {
    await applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor(applicationContext, {
        docketNumber,
        userId: user.userId,
      });
  }
};
