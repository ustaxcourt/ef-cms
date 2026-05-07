import { runCypressTestsWithTiming } from './run-cypress-tests-with-timing.helpers';

if (require.main === module) {
  void runCypressTestsWithTiming();
}
