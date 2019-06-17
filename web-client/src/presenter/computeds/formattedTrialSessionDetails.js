import { compact } from 'lodash';
import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  const result = get(state.trialSession);
  const eligibleCases = get(state.eligibleCases);

  result.formattedTerm = `${result.term} ${result.termYear.substr(-2)}`;

  result.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(result.startDate, 'MMDDYY');

  let [hour, min] = result.startTime.split(':');
  let startTimeExtension = 'am';

  if (+hour > 12) {
    startTimeExtension = 'pm';
    hour = +hour - 12;
  }
  result.formattedStartTime = `${hour}:${min} ${startTimeExtension}`;
  result.formattedJudge = result.judge || 'Not assigned';
  result.formattedTrialClerk = result.trialClerk || 'Not assigned';
  result.formattedCourtReporter = result.courtReporter || 'Not assigned';
  result.formattedIrsCalendarAdministrator =
    result.irsCalendarAdministrator || 'Not assigned';

  result.formattedCity = undefined;
  if (result.city) result.formattedCity = `${result.city},`;

  result.formattedCityStateZip = compact([
    result.formattedCity,
    result.state,
    result.postalCode,
  ]).join(' ');

  result.noLocationEntered =
    !result.courthouseName &&
    !result.address1 &&
    !result.address2 &&
    !result.formattedCityStateZip;

  result.showSwingSession =
    !!result.swingSession &&
    !!result.swingSessionId &&
    !!result.swingSessionLocation;

  if (eligibleCases) {
    result.formattedEligibleCases = eligibleCases.map(item => {
      item.docketNumberWithSuffix = `${
        item.docketNumber
      }${item.docketNumberSuffix || ''}`;
      return item;
    });
  }

  return result;
};
