export const checkForExistingMinuteSheetAction = async ({
  applicationContext,
  path,
  props,
}) => {
  const { caseDetail, trialSession } = props;

  // const minuteSheet = await applicationContext
  //   .getUseCases()
  //   .getMinuteSheetInteractor(applicationContext, {
  //     docketNumber: caseDetail.docketNumber,
  //     trialSessionId: trialSession.trialSessionId,
  //   });

  // const isExistingMinuteSheet = !!minuteSheet;

  // if (isExistingMinuteSheet) {
  //   console.log('its a yes');
  //   return path.yes();
  // }

  return path.no();
};
