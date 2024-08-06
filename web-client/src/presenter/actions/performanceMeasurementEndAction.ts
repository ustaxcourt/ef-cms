import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const performanceMeasurementEndAction = ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  sequenceName?: string;
  performanceMeasurementStart?: number;
  actionPerformanceArray?: { actionName: string; duration: number }[];
}>) => {
  const { email } = get(state.user) || {};
  const { actionPerformanceArray, performanceMeasurementStart, sequenceName } =
    props;

  if (
    !sequenceName ||
    !performanceMeasurementStart ||
    !email ||
    !actionPerformanceArray
  )
    return;

  const performanceMeasurementEnd = Date.now();
  const durationInSeconds =
    (performanceMeasurementEnd - performanceMeasurementStart) / 1000;

  const featureFlags = get(state.featureFlags);
  const MINIMUM_TIME_LIMIT_IN_SECONDS =
    +featureFlags[
      ALLOWLIST_FEATURE_FLAGS.SEQUENCE_PERFORMANCE_MINIMUM_TIME.key
    ] || 5;

  if (durationInSeconds > MINIMUM_TIME_LIMIT_IN_SECONDS) {
    const RESULTS: {
      sequenceName: string;
      duration: number;
      actionPerformanceArray: { actionName: string; duration: number }[];
      email: string;
    } = {
      actionPerformanceArray,
      duration: durationInSeconds,
      email,
      sequenceName,
    };

    console.log('RESULTS', RESULTS);
    applicationContext
      .getUseCases()
      .logUserPerformanceDataInteractor(applicationContext, RESULTS);
  }
};
