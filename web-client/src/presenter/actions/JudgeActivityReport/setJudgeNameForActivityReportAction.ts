import { state } from 'cerebral';

/**
 * Sets setJudgeNameForActivityReportAction on state
 *
 * @param {object} providers the providers object
 * @param {object} applicationContext the applicationContext
 * @param {object} providers.store the cerebral store object
 */
export const setJudgeNameForActivityReportAction = ({
  applicationContext,
  store,
}) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  const isChambersUser = user.role === USER_ROLES.chambers;

  let judgeName;
  if (isChambersUser) {
    const chambersData: any = applicationContext
      .getUtilities()
      .getJudgesChambers();

    const userSectionInfo: any = Object.values(chambersData).find(
      obj => obj.section === user.section,
    );

    judgeName = applicationContext
      .getUtilities()
      .getJudgeLastName(userSectionInfo.judgeFullName);
  } else {
    judgeName = user.name;
  }

  store.set(state.form.judgeName, judgeName);
};
