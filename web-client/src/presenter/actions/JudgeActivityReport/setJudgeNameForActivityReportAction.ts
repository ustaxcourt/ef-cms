import { state } from 'cerebral';

/**
 * Sets setJudgeNameForActivityReportAction on state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setJudgeNameForActivityReportAction = async ({ props, store }) => {
  const user = await applicationContext.getCurrentUser();

  const isChambersUser = user.role === ROLES.chambers;

  let judgeName;
  if (isChambersUser) {
    const chambersData: any = applicationContext
      .getUtilities()
      .getJudgesChambers();

    const userSectionInfo: any = Object.values(chambersData).find(
      obj => obj.section === user.section,
    );

    //how
    judgeName = getJudgeLastName(userSectionInfo.judgeFullName);
  } else {
    judgeName = user.name;
  }

  //use this in helper
  store.set(form, judgeName);
};
