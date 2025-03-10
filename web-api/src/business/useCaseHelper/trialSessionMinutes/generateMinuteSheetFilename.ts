import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

export const generateMinuteSheetFilename = ({
  trialSession,
  caseDetail,
}: {
  trialSession: RawTrialSession;
  caseDetail: RawCase;
}): string => {
  const location = trialSession.trialLocation
    ?.split(',')
    .filter(item => !!item)
    .map(item => item.trim())
    .join('_');

  const date = formatDateString(
    trialSession.startDate,
    FORMATS.MMDDYYYY_UNDERSCORED,
  );

  return `${caseDetail.docketNumber} Minutes-${location ? location + ' ' : ''}${date}.pdf`;
};
