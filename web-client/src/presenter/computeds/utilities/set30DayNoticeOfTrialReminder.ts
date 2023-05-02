/**
 * sets the NOTT reminder alert flag and due date when the current date is between 30-35 days of the trial start date
 *
 * @param {object} applicationContext - applicationContext the application context
 * @param {object} trialStartDate - the start date of the trial session
 * @returns {object} the NOTT reminder flag and due date
 */
export const set30DayNoticeOfTrialReminder = ({
  applicationContext,
  trialStartDate,
}: {
  applicationContext: IApplicationContext;
  trialStartDate: any;
}) => {
  const { DATE_FORMATS } = applicationContext.getConstants();

  const trialStartDateString: any = applicationContext
    .getUtilities()
    .prepareDateFromString(trialStartDate, DATE_FORMATS.MMDDYY);

  const thirtyFiveDaysBeforeTrial: any = trialStartDateString.minus({
    ['days']: 35,
  });

  const thirtyDaysBeforeTrial: any = trialStartDateString.minus({
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
