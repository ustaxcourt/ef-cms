import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { set30DayNoticeOfTrialReminder } from './set30DayNoticeOfTrialReminder';

describe('set30DayNoticeOfTrialReminder', () => {
  const mockTrialStartDate: string = '10/10/2020';
  const mockThirtyDaysBeforeTrialFormatted: string = '09/11/2020';

  it('should convert the trial date sting into a luxon object', () => {
    set30DayNoticeOfTrialReminder({
      applicationContext,
      trialStartDate: mockTrialStartDate,
    });

    expect(
      applicationContext.getUtilities().prepareDateFromString,
    ).toHaveBeenCalledWith(mockTrialStartDate, FORMATS.MMDDYY);
  });

  it('should make a call to check whether the current date falls within the 30-35 day time interval', () => {
    set30DayNoticeOfTrialReminder({
      applicationContext,
      trialStartDate: mockTrialStartDate,
    });

    expect(
      applicationContext.getUtilities().isTodayWithinGivenInterval,
    ).toHaveBeenCalled();
  });

  it('should return isCurrentDateWithinReminderRange true and and thirtyDaysBeforeTrialFormatted when the current date is within the date range', () => {
    applicationContext
      .getUtilities()
      .isTodayWithinGivenInterval.mockReturnValue(true);

    applicationContext
      .getUtilities()
      .formatDateString.mockReturnValue(mockThirtyDaysBeforeTrialFormatted);

    const result = set30DayNoticeOfTrialReminder({
      applicationContext,
      trialStartDate: mockTrialStartDate,
    });

    expect(result).toEqual({
      isCurrentDateWithinReminderRange: true,
      thirtyDaysBeforeTrialFormatted: mockThirtyDaysBeforeTrialFormatted,
    });
  });

  it('should return isCurrentDateWithinReminderRange fals when the current date is NOT within the date range', () => {
    applicationContext
      .getUtilities()
      .isTodayWithinGivenInterval.mockReturnValue(false);

    const result = set30DayNoticeOfTrialReminder({
      applicationContext,
      trialStartDate: mockTrialStartDate,
    });

    expect(result.isCurrentDateWithinReminderRange).toBe(false);
  });
});
