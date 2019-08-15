import { camelCase, pickBy } from 'lodash';
import {
  compareCasesByDocketNumber,
  formatCase,
} from './formattedTrialSessionDetails';
import { state } from 'cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount = (a.practitioners && a.practitioners.length && 1) || 0;
  const bCount = (b.practitioners && b.practitioners.length && 1) || 0;

  return aCount - bCount;
};

export const trialSessionWorkingCopyHelper = (get, applicationContext) => {
  const { TRIAL_STATUS_TYPES } = get(state.constants);
  const trialSession = get(state.trialSession) || {};
  const { caseMetadata, filters, sort, sortOrder } =
    get(state.trialSessionWorkingCopy) || {};

  const formatCaseName = myCase => {
    myCase.caseName = applicationContext.getCaseCaptionNames(
      myCase.caseCaption || '',
    );
    return myCase;
  };

  //get an array of strings of the trial statuses that are set to true
  const trueFilters = Object.keys(pickBy(filters));

  let formattedSessions = (trialSession.calendaredCases || [])
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
    .map(formatCase)
    .map(formatCaseName)
    .sort(compareCasesByDocketNumber);

  const sessionsShownCount = formattedSessions.length;

  if (sort === 'practitioner') {
    formattedSessions = formattedSessions.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    formattedSessions = formattedSessions.slice().reverse();
  }

  const trialStatusOptions = TRIAL_STATUS_TYPES.map(value => ({
    key: camelCase(value),
    value,
  }));

  return {
    formattedSessions,
    sessionsShownCount,
    title: trialSession.title || 'Birmingham, Alabama',
    trialStatusOptions,
  };
};
