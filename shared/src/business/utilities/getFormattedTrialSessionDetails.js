const { compact, isEmpty, isEqual, partition } = require('lodash');

exports.formatCase = ({ applicationContext, caseItem }) => {
  caseItem.docketNumberWithSuffix = `${caseItem.docketNumber}${
    caseItem.docketNumberSuffix || ''
  }`;

  caseItem.caseTitle = applicationContext.getCaseTitle(
    caseItem.caseCaption || '',
  );
  if (caseItem.removedFromTrialDate) {
    caseItem.removedFromTrialDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(caseItem.removedFromTrialDate, 'MMDDYY');
  }
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();
  const highPrioritySuffixes = [
    DOCKET_NUMBER_SUFFIXES.LIEN_LEVY, // L
    DOCKET_NUMBER_SUFFIXES.PASSPORT, // P
    DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY, // SL
  ];
  caseItem.isDocketSuffixHighPriority = highPrioritySuffixes.includes(
    caseItem.docketNumberSuffix,
  );
  return caseItem;
};

exports.compareTrialSessionEligibleCases = (a, b) => {
  if (a.isManuallyAdded && !b.isManuallyAdded) {
    return -1;
  } else if (!a.isManuallyAdded && b.isManuallyAdded) {
    return 1;
  } else if (a.highPriority && !b.highPriority) {
    return -1;
  } else if (!a.highPriority && b.highPriority) {
    return 1;
  } else if (a.isDocketSuffixHighPriority && !b.isDocketSuffixHighPriority) {
    return -1;
  } else if (!a.isDocketSuffixHighPriority && b.isDocketSuffixHighPriority) {
    return 1;
  } else {
    return exports.compareCasesByDocketNumber(a, b);
  }
};

exports.compareCasesByDocketNumber = (a, b) => {
  if (!a || !a.docketNumber || !b || !b.docketNumber) {
    return 0;
  }

  const [numberA, yearA] = a.docketNumber.split('-');
  const [numberB, yearB] = b.docketNumber.split('-');

  let yearDifference = +yearA - +yearB;
  if (yearDifference === 0) {
    return +numberA - +numberB;
  } else {
    return yearDifference;
  }
};

exports.formattedTrialSessionDetails = ({
  applicationContext,
  trialSession,
}) => {
  if (!trialSession) return undefined;

  trialSession.formattedEligibleCases = (trialSession.eligibleCases || [])
    .map(caseItem => exports.formatCase({ applicationContext, caseItem }))
    .sort(exports.compareTrialSessionEligibleCases);

  trialSession.allCases = (trialSession.calendaredCases || [])
    .map(caseItem => exports.formatCase({ applicationContext, caseItem }))
    .sort(exports.compareCasesByDocketNumber);

  [trialSession.inactiveCases, trialSession.openCases] = partition(
    trialSession.allCases,
    item => item.removedFromTrial === true,
  );

  trialSession.formattedTerm = `${
    trialSession.term
  } ${trialSession.termYear.substr(-2)}`;

  trialSession.computedStatus = exports.getTrialSessionStatus({
    applicationContext,
    session: trialSession,
  });

  trialSession.formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMDDYY');

  trialSession.formattedStartDateFull = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMMM DD, YYYY');

  let [hour, min] = trialSession.startTime.split(':');
  let startTimeExtension = 'am';

  if (+hour > 12) {
    startTimeExtension = 'pm';
    hour = +hour - 12;
  }
  trialSession.formattedStartTime = `${hour}:${min} ${startTimeExtension}`;
  trialSession.formattedJudge =
    (trialSession.judge && trialSession.judge.name) || 'Not assigned';
  trialSession.formattedTrialClerk =
    (trialSession.trialClerk && trialSession.trialClerk.name) || 'Not assigned';
  trialSession.formattedCourtReporter =
    trialSession.courtReporter || 'Not assigned';
  trialSession.formattedIrsCalendarAdministrator =
    trialSession.irsCalendarAdministrator || 'Not assigned';

  trialSession.formattedCity = undefined;
  if (trialSession.city) trialSession.formattedCity = `${trialSession.city},`;

  trialSession.formattedCityStateZip = compact([
    trialSession.formattedCity,
    trialSession.state,
    trialSession.postalCode,
  ]).join(' ');

  trialSession.noLocationEntered =
    !trialSession.courthouseName &&
    !trialSession.address1 &&
    !trialSession.address2 &&
    !trialSession.formattedCityStateZip;

  trialSession.showSwingSession =
    !!trialSession.swingSession &&
    !!trialSession.swingSessionId &&
    !!trialSession.swingSessionLocation;

  const trialDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMMM_D_YYYY');
  const { trialLocation } = trialSession;
  trialSession.zipName = `${trialDate}-${trialLocation}.zip`
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  return trialSession;
};

exports.getTrialSessionStatus = ({ applicationContext, session }) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();

  const allCases = session.caseOrder || [];
  const inactiveCases = allCases.filter(
    sessionCase => sessionCase.removedFromTrial === true,
  );

  if (!isEmpty(allCases) && isEqual(allCases, inactiveCases)) {
    return SESSION_STATUS_GROUPS.closed;
  } else if (session.isCalendared) {
    return SESSION_STATUS_GROUPS.open;
  } else {
    return SESSION_STATUS_GROUPS.new;
  }
};
