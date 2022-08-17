import { camelCase, partition, pickBy } from 'lodash';
import { state } from 'cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount =
    (a.privatePractitioners && a.privatePractitioners.length && 1) || 0;
  const bCount =
    (b.privatePractitioners && b.privatePractitioners.length && 1) || 0;

  return aCount - bCount;
};

export const trialSessionWorkingCopyHelper = (get, applicationContext) => {
  const { STATUS_TYPES, TRIAL_STATUS_TYPES } =
    applicationContext.getConstants();

  const trialSession = get(state.trialSession);
  const { caseMetadata, filters, sort, sortOrder, userNotes } = get(
    state.trialSessionWorkingCopy,
  );

  //get an array of strings of the trial statuses that are set to true
  const trueFilters = Object.keys(pickBy(filters));

  const [leadAndUnconsolidatedCases, memberConsolidatedCases] = partition(
    trialSession.calendaredCases || [],
    calendaredCase => {
      return (
        !calendaredCase.leadDocketNumber ||
        calendaredCase.docketNumber === calendaredCase.leadDocketNumber
      );
    },
  );

  leadAndUnconsolidatedCases.forEach(leadCase => {
    leadCase.consolidatedCases = [];
  });

  memberConsolidatedCases.forEach(memberCase => {
    const leadCase = leadAndUnconsolidatedCases.find(consolidatedCase => {
      return consolidatedCase.leadDocketNumber === memberCase.leadDocketNumber;
    });

    leadCase.consolidatedCases
      ? leadCase.consolidatedCases.push(memberCase)
      : (leadCase.consolidatedCases = [memberCase]);

    leadCase.consolidatedCases.sort(
      applicationContext.getUtilities().compareCasesByDocketNumber,
    );
  });

  let formattedCases = leadAndUnconsolidatedCases
    .slice()
    .filter(
      calendaredCase =>
        calendaredCase.status !== STATUS_TYPES.closed &&
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

  if (sort === 'practitioner') {
    formattedCases.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    formattedCases.reverse();
  }

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

  const trialStatusOptions = TRIAL_STATUS_TYPES.map(value => ({
    key: camelCase(value),
    value,
  }));

  return {
    casesShownCount: formattedCases.length,
    formattedCases,
    trialStatusOptions,
  };
};
