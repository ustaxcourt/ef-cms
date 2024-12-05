import { updateTrialSessionMinutesFormAction } from '@web-client/presenter/actions/TrialSessionMinutes/updateTrialSessionMinutesFormAction';

export const trialSessionMinutesOnChangeSequence = [
  updateTrialSessionMinutesFormAction,
] as unknown as ({
  name,
  rowInfo,
  section,
  value,
}: {
  name: string;
  rowInfo?: { key: string; nestedName?: string };
  section: string;
  value: string | boolean;
}) => void;
