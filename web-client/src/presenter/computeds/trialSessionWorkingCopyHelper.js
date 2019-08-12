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

  return {
    formattedSessions,
    title: trialSession.title || 'Birmingham, Alabama',
  };
};
