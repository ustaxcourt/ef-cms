import {
  compareCasesByDocketNumber,
  formatCase,
} from './formattedTrialSessionDetails';
import { state } from 'cerebral';

export const trialSessionWorkingCopyHelper = get => {
  const trialSession = get(state.trialSession) || {};

  let formattedSessions = (trialSession.calendaredCases || [])
    .map(formatCase)
    .sort(compareCasesByDocketNumber);

  return {
    formattedSessions,
    title: trialSession.title || 'Birmingham, Alabama',
  };
};
