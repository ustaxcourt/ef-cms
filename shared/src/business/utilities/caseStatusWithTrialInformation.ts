import { CaseStatus } from '@shared/business/entities/EntityConstants';

export function caseStatusWithTrialInformation({
  applicationContext,
  caseStatus,
  trialDate,
  trialLocation,
}: {
  caseStatus: CaseStatus;
  trialLocation?: string;
  applicationContext: IApplicationContext;
  trialDate?: string;
}): string {
  const { STATUS_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();

  if (caseStatus !== STATUS_TYPES.calendared) {
    return caseStatus;
  }

  const formattedTrialDate = trialDate
    ? applicationContext.getUtilities().formatDateString(trialDate, 'MM/dd/yy')
    : 'NA';

  let formattedTrialLocation = '';
  if (trialLocation) {
    formattedTrialLocation =
      trialLocation === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
        ? TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
        : applicationContext.getUtilities().abbreviateState(trialLocation);
  }

  return `${caseStatus} - ${formattedTrialDate} ${formattedTrialLocation}`;
}
