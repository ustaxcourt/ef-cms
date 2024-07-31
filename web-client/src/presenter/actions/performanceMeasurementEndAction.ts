export const performanceMeasurementEndAction = ({
  props,
}: ActionProps<{
  sequenceName?: string;
  performanceMeasurementStart?: number;
}>) => {
  const { performanceMeasurementStart, sequenceName } = props;
  if (!sequenceName || !performanceMeasurementStart) return;
  const performanceMeasurementEnd = Date.now();
  const durationInSeconds =
    (performanceMeasurementEnd - performanceMeasurementStart) / 1000;

  const MINIMUM_TIME_LIMIT_IN_SECONDS = 5;
  if (durationInSeconds > MINIMUM_TIME_LIMIT_IN_SECONDS)
    console.log(`${sequenceName}: ${durationInSeconds} seconds`);
};
