import { logUserPerformanceDataInteractor } from '@shared/proxies/system/logUserPerformanceDataProxy';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { SequencePerformance } from '@web-client/presenter/actions/performanceMeasurementEndAction';

let performanceMonitorCache: PerformanceMonitor;
export function getPerformanceMonitor() {
  if (!performanceMonitorCache) {
    performanceMonitorCache = new PerformanceMonitor();
  }

  return performanceMonitorCache;
}

class PerformanceMonitor {
  private performanceInfo: { [actionName: string]: number[] } = {};
  private lastTimeDrained: number = Date.now();
  private readonly PERFORMANCE_DRAIN_INTERVAL = 1 * 60 * 1000;
  constructor() {}

  addPerformanceMetric({
    sequencePerformance,
  }: {
    sequencePerformance: SequencePerformance;
  }) {
    const storedSeqencePerformance =
      this.performanceInfo[sequencePerformance.sequenceName];

    if (storedSeqencePerformance) {
      storedSeqencePerformance.push(sequencePerformance.duration);
    } else {
      this.performanceInfo[sequencePerformance.sequenceName] = [
        sequencePerformance.duration,
      ];
    }

    sequencePerformance.actionPerformanceArray.forEach(actionPerformance => {
      const storedActionPerformance =
        this.performanceInfo[actionPerformance.actionName];

      if (storedActionPerformance) {
        storedActionPerformance.push(actionPerformance.duration);
      } else {
        this.performanceInfo[actionPerformance.actionName] = [
          actionPerformance.duration,
        ];
      }
    });
  }

  async drainPerformanceMetrics({
    applicationContext,
  }: {
    applicationContext: ClientApplicationContext;
  }): Promise<void> {
    const now = Date.now();
    if (now - this.lastTimeDrained > this.PERFORMANCE_DRAIN_INTERVAL) {
      const perfInfo = this.performanceInfo;
      this.performanceInfo = {};
      this.lastTimeDrained = Date.now();
      await logUserPerformanceDataInteractor(applicationContext, perfInfo);
    }
  }
}
