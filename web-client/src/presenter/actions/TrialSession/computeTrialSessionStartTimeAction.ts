export const computeTrialSessionStartTimeAction = ({
  props,
}: ActionProps): {
  startTimeExtension?: string;
  startTimeHours?: string;
  startTimeMinutes?: string;
} => {
  if (!props.trialSession.startTime) return {};
  const startTimeArray = props.trialSession.startTime.split(':');
  let startTimeHours = startTimeArray[0];
  const startTimeMinutes = startTimeArray[1];
  let startTimeExtension = 'am';

  if (+startTimeHours >= 12) {
    startTimeHours = `${+startTimeHours - 12}`;
    startTimeExtension = 'pm';
  }

  if (+startTimeHours === 0) {
    startTimeHours = '12';
  }

  return { startTimeExtension, startTimeHours, startTimeMinutes };
};
