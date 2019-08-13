import { camelCase } from 'lodash';
import {
  compareCasesByDocketNumber,
  formatCase,
} from './formattedTrialSessionDetails';
import { state } from 'cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount = (a.practitioners.length && 1) || 0;
  const bCount = (b.practitioners.length && 1) || 0;

  return aCount - bCount;
};

export const trialSessionWorkingCopyHelper = (get, applicationContext) => {
  const trialSession = get(state.trialSession) || {};
  const { sort, sortOrder } = get(state.trialSessionWorkingCopy) || {};

  const formatCaseName = myCase => {
    myCase.caseName = applicationContext.getCaseCaptionNames(
      myCase.caseCaption || '',
    );
    return myCase;
  };

  let formattedSessions = (trialSession.calendaredCases || [])
    .map(formatCase)
    .map(formatCaseName)
    .sort(compareCasesByDocketNumber);

  if (sort === 'practitioner') {
    formattedSessions = formattedSessions.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'asc') {
    formattedSessions = formattedSessions.slice().reverse();
  }

  const trialStatusOptions = [
    'Set for Trial',
    'Dismissed',
    'Continued',
    'Rule 122',
    'A Basis Reached',
    'Settled',
    'Recall',
    'Taken Under Advisement',
  ].map(value => ({ key: camelCase(value), value }));

  return {
    formattedSessions,
    title: trialSession.title || 'Birmingham, Alabama',
    trialStatusOptions,
  };
};
