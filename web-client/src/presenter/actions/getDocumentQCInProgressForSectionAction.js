import { state } from 'cerebral';

/**
 * fetched the document qc in progress items for a section.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInProgressForSectionAction = async ({
  applicationContext,
  get,
}) => {
  const { CHIEF_JUDGE, USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  let judgeUser = get(state.judgeUser);

  if (!judgeUser && user.role === USER_ROLES.adc) {
    judgeUser = { name: CHIEF_JUDGE };
  }

  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInProgressForSectionInteractor(applicationContext, {
      judgeUser,
      section: user.section,
    });

  return { workItems };
};
