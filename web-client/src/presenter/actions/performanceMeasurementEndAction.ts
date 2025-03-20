import { state } from '@web-client/presenter/app.cerebral';
import { getPerformanceMonitor } from '@web-client/presenter/utilities/performanceMonitor';

export type SequencePerformance = {
  sequenceName: string;
  duration: number;
  actionPerformanceArray: {
    actionName: string;
    duration: number;
  }[];
};

export const performanceMeasurementEndAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  sequenceName?: string;
  performanceMeasurementStart?: number;
  actionPerformanceArray?: { actionName: string; duration: number }[];
}>) => {
  const userToken = get(state.token);
  const { actionPerformanceArray, performanceMeasurementStart, sequenceName } =
    props;

  if (
    !sequenceName ||
    !performanceMeasurementStart ||
    !actionPerformanceArray ||
    !userToken
  )
    return;

  const performanceMeasurementEnd = Date.now();
  const duration = performanceMeasurementEnd - performanceMeasurementStart;

  const sequencePerformance: SequencePerformance = {
    actionPerformanceArray,
    duration,
    sequenceName,
  };

  getPerformanceMonitor().addPerformanceMetric({ sequencePerformance });

  try {
    await getPerformanceMonitor().drainPerformanceMetrics({
      applicationContext,
    });
  } catch (e) {
    // The user should never receive information about errors when capturing performance fails. Always swallow error.
    console.error('Error posting performance');
  }
};
