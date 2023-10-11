import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeLastNameOnJudgeActivityReportAction = ({
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
      .getJudgeLastName(userSectionInfo!.judgeFullName);
  } else {
    judgeName = user.name;
  }

  store.set(state.judgeActivityReport.judgeName, judgeName);
  store.set(state.judgeActivityReport.judgeNameToDisplayForHeader, judgeName);
};
