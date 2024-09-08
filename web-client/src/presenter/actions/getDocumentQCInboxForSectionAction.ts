import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetched the document qc inbox items for a section.
 * @param {object} applicationContext object that contains all the context specific methods
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForSectionAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const selectedSection = get(state.workQueueToDisplay.section);

  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();
  const user = get(state.user);
  let judgeUser = get(state.judgeUser);

  if (!judgeUser && user.role === USER_ROLES.adc) {
    judgeUser = { name: CHIEF_JUDGE };
  }

  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInboxForSectionInteractor(applicationContext, {
      judgeUser,
      section: selectedSection || user.section,
    });

  return { workItems };
};
