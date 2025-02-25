import {
  CASE_STATUS_TYPES,
  CaseStatus,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { abbreviateState } from './abbreviateState';
import { formatDateString } from '@shared/business/utilities/DateHandler';

export function caseStatusWithTrialInformation({
  caseStatus,
  trialDate,
  trialLocation,
}: {
  caseStatus: CaseStatus;
  trialLocation?: string;
  trialDate?: string;
}): string {
  if (caseStatus !== CASE_STATUS_TYPES.calendared) {
    return caseStatus;
  }

  const formattedTrialDate = trialDate
    ? formatDateString(trialDate, 'MM/dd/yy')
    : 'NA';

  let formattedTrialLocation = '';
  if (trialLocation) {
    formattedTrialLocation =
      trialLocation === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
        ? TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
        : abbreviateState(trialLocation);
  }

  return `${caseStatus} - ${formattedTrialDate} ${formattedTrialLocation}`;
}
