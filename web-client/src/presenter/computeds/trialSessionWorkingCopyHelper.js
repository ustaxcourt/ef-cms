import { omitBy, partition, pickBy } from 'lodash';
import { state } from 'cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount =
    (a.privatePractitioners && a.privatePractitioners.length && 1) || 0;
  const bCount =
    (b.privatePractitioners && b.privatePractitioners.length && 1) || 0;

  return aCount - bCount;
};

export const trialSessionWorkingCopyHelper = (get, applicationContext) => {
  const { ALLOWLIST_FEATURE_FLAGS, TRIAL_STATUS_TYPES } =
    applicationContext.getConstants();

  const trialSession = get(state.trialSession);
  const { caseMetadata, filters, sort, sortOrder, userNotes } = get(
    state.trialSessionWorkingCopy,
  );

  //get an array of strings of the trial statuses that are set to true
  const trueFilters = Object.keys(pickBy(filters));

  let formattedCases = (trialSession.calendaredCases || [])
    .slice()
    .filter(
      calendaredCase =>
        !applicationContext.getUtilities().isClosed(calendaredCase) &&
        calendaredCase.removedFromTrial !== true,
    )
    .filter(
      calendaredCase =>
        (trueFilters.includes('statusUnassigned') &&
          (!caseMetadata[calendaredCase.docketNumber] ||
            !caseMetadata[calendaredCase.docketNumber].trialStatus)) ||
        (caseMetadata[calendaredCase.docketNumber] &&
          trueFilters.includes(
            caseMetadata[calendaredCase.docketNumber].trialStatus,
          )),
    )
    .map(caseItem =>
      applicationContext
        .getUtilities()
        .formatCaseForTrialSession({ applicationContext, caseItem }),
    )
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber);

  Object.keys(userNotes || {}).forEach(docketNumber => {
    const caseToUpdate = formattedCases.find(
      aCase => aCase.docketNumber === docketNumber,
    );
    if (caseToUpdate) {
      caseToUpdate.userNotes = userNotes[docketNumber].notes;
    }
  });

  trialSession.caseOrder.forEach(aCase => {
    if (aCase.calendarNotes) {
      const caseToUpdate = formattedCases.find(
        theCase => theCase.docketNumber === aCase.docketNumber,
      );
      if (caseToUpdate) {
        caseToUpdate.calendarNotes = aCase.calendarNotes;
      }
    }
  });

  const [leadAndUnconsolidatedCases, memberConsolidatedCases] = partition(
    formattedCases,
    calendaredCase => {
      return (
        !calendaredCase.leadDocketNumber ||
        applicationContext.getUtilities().isLeadCase(calendaredCase)
      );
    },
  );

  leadAndUnconsolidatedCases.forEach(caseToUpdate => {
    if (caseToUpdate.leadCase) {
      caseToUpdate.consolidatedCases = memberConsolidatedCases.filter(
        memberCase => {
          return memberCase.leadDocketNumber === caseToUpdate.leadDocketNumber;
        },
      );

      caseToUpdate.consolidatedCases.sort(
        applicationContext.getUtilities().compareCasesByDocketNumber,
      );
    }
  });

  let casesAssociatedWithTrialSession = leadAndUnconsolidatedCases;

  memberConsolidatedCases.forEach(memberCase => {
    const leadCaseAssociatedWithTrialSession = leadAndUnconsolidatedCases.find(
      c => c.docketNumber === memberCase.leadDocketNumber,
    );
    if (!leadCaseAssociatedWithTrialSession) {
      casesAssociatedWithTrialSession.push(memberCase);
    }
  });

  casesAssociatedWithTrialSession.sort(
    applicationContext.getUtilities().compareCasesByDocketNumber,
  );

  if (sort === 'practitioner') {
    casesAssociatedWithTrialSession.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    casesAssociatedWithTrialSession.reverse();
  }

  const updatedTrialSessionTypesEnabled = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.UPDATED_TRIAL_STATUS_TYPES.key],
  );

  const unassignedLabel = updatedTrialSessionTypesEnabled
    ? 'Unassigned'
    : 'Trial Status';

  const trialStatusOptions = omitBy(TRIAL_STATUS_TYPES, statusType => {
    if (updatedTrialSessionTypesEnabled !== true) {
      return statusType.new === true;
    }
  });

  const trialStatusFilters = Object.keys(trialStatusOptions)
    .filter(option => {
      if (updatedTrialSessionTypesEnabled) {
        return !trialStatusOptions[option].deprecated;
      }
      return option;
    })
    .sort((a, b) => {
      if (updatedTrialSessionTypesEnabled) {
        return (
          trialStatusOptions[a].displayOrder -
          trialStatusOptions[b].displayOrder
        );
      }
      return 0;
    })
    .map(option => {
      return {
        key: option,
        label:
          !updatedTrialSessionTypesEnabled &&
          trialStatusOptions[option].legacyLabel
            ? trialStatusOptions[option].legacyLabel
            : trialStatusOptions[option].label,
      };
    })
    .concat({
      key: 'statusUnassigned',
      label: updatedTrialSessionTypesEnabled
        ? 'Unassigned'
        : 'Status unassigned',
    });

  return {
    casesShownCount: formattedCases.length,
    formattedCases: casesAssociatedWithTrialSession,
    showPrintButton: formattedCases.length > 0,
    trialStatusFilters,
    trialStatusOptions,
    unassignedLabel,
    updatedTrialSessionTypesEnabled,
  };
};
