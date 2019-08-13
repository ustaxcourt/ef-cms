import { camelCase } from 'lodash';
import {
  compareCasesByDocketNumber,
  formatCase,
} from './formattedTrialSessionDetails';
import { state } from 'cerebral';

export const trialSessionWorkingCopyHelper = (get, applicationContext) => {
  const trialSession = get(state.trialSession) || {};

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
