import { addMinuteSheetFormRowAction } from '@web-client/presenter/actions/TrialSessionMinutes/addMinuteSheetFormRowAction';

export const addMinuteSheetFormRowSequence = [
  addMinuteSheetFormRowAction,
] as unknown as ({ name, section }: { name: string; section: string }) => void;
