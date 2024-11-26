import { updateTrialSessionMinutesFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/updateTrialSessionMinutesFormAction';

export const trialSessionMinutesOnChangeSequence = [
  updateTrialSessionMinutesFormAction,
] as unknown as ({
  name,
  section,
  value,
}: {
  name: string;
  section: string;
  value: string | boolean;
}) => void;
