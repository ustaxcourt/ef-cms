import { DateTime } from 'luxon';

export const performanceMeasurementEndAction = ({
  applicationContext,
  props,
}: ActionProps<{
  sequenceName?: string;
  performanceMeasurementStart?: number;
  actionPerformanceArray?: { actionName: string; duration: number }[];
}>) => {
  const { actionPerformanceArray, performanceMeasurementStart, sequenceName } =
    props;

  if (!sequenceName || !performanceMeasurementStart || !actionPerformanceArray)
    return;

  const performanceMeasurementEnd = DateTime.now().toMillis();
  const durationInSeconds =
    (performanceMeasurementEnd - performanceMeasurementStart) / 1000;

  const RESULTS: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
  } = {
    actionPerformanceArray,
    duration: durationInSeconds,
    sequenceName,
  };

  applicationContext
    .getUseCases()
    .logUserPerformanceDataInteractor(applicationContext, RESULTS);
};
