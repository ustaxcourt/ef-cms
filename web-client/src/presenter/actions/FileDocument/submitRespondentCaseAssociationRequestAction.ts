import { state } from '@web-client/presenter/app.cerebral';

/**
 * submit case association request for a respondent
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitRespondentCaseAssociationRequestAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);

  const user = applicationContext.getCurrentUser();

  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.irsPractitioner) {
    return await applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor(applicationContext, {
        docketNumber,
      });
  }
};
