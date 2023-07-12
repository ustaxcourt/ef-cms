import { state } from 'cerebral';

/**
 * Sets last name of the judge on form used for the judge activity report on state
 *
 * @param {object} providers the providers object
 * @param {object} applicationContext the applicationContext
 * @param {object} providers.store the cerebral store object
 */
export const setJudgeLastNameOnFormAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const { USER_ROLES } = applicationContext.getConstants();

  const user = applicationContext.getCurrentUser();

  const isChambersUser: boolean = user.role === USER_ROLES.chambers;

  let judgeName: string;
  if (isChambersUser) {
    const chambersData = applicationContext.getUtilities().getJudgesChambers();

    const userSectionInfo = Object.values(chambersData).find(
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
