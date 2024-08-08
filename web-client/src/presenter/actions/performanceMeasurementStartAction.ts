import { DateTime } from 'luxon';

export const performanceMeasurementStartAction = ({
  props,
}: ActionProps<{ sequenceName?: string }>) => {
  const { sequenceName } = props;
  if (sequenceName) {
    const startTime = DateTime.now().toMillis();
    return {
      performanceMeasurementStart: startTime,
    };
  }
};
