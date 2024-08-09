import { DateTime } from 'luxon';

export const performanceMeasurementStartAction = ({
  props,
}: ActionProps<{ sequenceName?: string }>) => {
  const { sequenceName } = props;
  if (!sequenceName) return;

  const startTime = DateTime.now().toMillis();
  return {
    performanceMeasurementStart: startTime,
  };
};
