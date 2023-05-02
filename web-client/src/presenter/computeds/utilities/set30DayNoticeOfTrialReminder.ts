export const set30DayNoticeOfTrialReminder = ({
  applicationContext,
  trialStartDate,
}) => {
  const { DATE_FORMATS } = applicationContext.getConstants();

  const thirtyFiveDaysBeforeTrial: any = applicationContext
    .getUtilities()
    .prepareDateFromString(trialStartDate, DATE_FORMATS.MMDDYY)
    .minus({
      ['days']: 35,
    });

  const thirtyDaysBeforeTrial: any = applicationContext
    .getUtilities()
    .prepareDateFromString(trialStartDate, DATE_FORMATS.MMDDYY)
    .minus({
      ['days']: 30,
    });

  const isCurrentDateWithinReminderRange: boolean = applicationContext
    .getUtilities()
    .isTodayWithinGivenInterval({
      intervalEndDate: thirtyDaysBeforeTrial,
      intervalStartDate: thirtyFiveDaysBeforeTrial,
    });

  const thirtyDaysBeforeTrialFormatted: any = applicationContext
    .getUtilities()
    .formatDateString(thirtyDaysBeforeTrial, DATE_FORMATS.MMDDYY);

  return { isCurrentDateWithinReminderRange, thirtyDaysBeforeTrialFormatted };
};
