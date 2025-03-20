export const performanceMeasurementStartAction = ({
  props,
}: ActionProps<{ sequenceName?: string }>) => {
  const { sequenceName } = props;
  if (!sequenceName) return;

  const startTime = Date.now();
  return {
    performanceMeasurementStart: startTime,
  };
};
