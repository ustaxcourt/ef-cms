import { removeMinuteSheetFormRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/removeMinuteSheetFormRowAction';

export const removeMinuteSheetFormRowSequence = [
  removeMinuteSheetFormRowAction,
] as unknown as ({
  key,
  name,
  section,
}: {
  name: string;
  key: string;
  section: string;
}) => void;
