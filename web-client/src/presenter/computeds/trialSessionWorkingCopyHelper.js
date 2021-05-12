import { camelCase, pickBy } from 'lodash';
import { makeMap } from './makeMap';
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
  const trialSession = get(state.trialSession) || {};
  const { filters, sort, sortOrder, userNotes } =
    get(state.trialSessionWorkingCopy) || {};
  const caseMetadata = get(state.trialSessionWorkingCopy.caseMetadata) || {};

  //get an array of strings of the trial statuses that are set to true
  const trueFilters = Object.keys(pickBy(filters));

  let formattedCases = (trialSession.calendaredCases || [])
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

  const casesShownCount = formattedCases.length;

  if (sort === 'practitioner') {
    formattedCases.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    formattedCases.reverse();
  }

  const trialStatusOptions = TRIAL_STATUS_TYPES.map(value => ({
    key: camelCase(value),
    value,
  }));

  const formattedCasesByDocketRecord = makeMap(formattedCases, 'docketNumber');

  Object.keys(userNotes).forEach(docketNumber => {
    if (userNotes[docketNumber]) {
      const caseToUpdate = formattedCases.find(
        aCase => aCase.docketNumber === docketNumber,
      );
      if (caseToUpdate) {
        caseToUpdate.userNotes = userNotes[docketNumber].notes;
      }
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

  return {
    casesShownCount,
    formattedCases,
    formattedCasesByDocketRecord,
    title: trialSession.title || 'Birmingham, Alabama',
    trialStatusOptions,
  };
};
