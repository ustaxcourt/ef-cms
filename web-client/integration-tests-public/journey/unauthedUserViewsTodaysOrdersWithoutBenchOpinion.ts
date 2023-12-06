import { BENCH_OPINION_EVENT_CODE } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrdersWithoutBenchOpinion =
  cerebralTest => {
    return it('should view todays orders and should not see a bench opinion', async () => {
      await refreshElasticsearchIndex();

      await cerebralTest.runSequence('gotoTodaysOrdersSequence', {});

      const todaysOrders = cerebralTest.getState('todaysOrders.results');

      const foundBenchOpinion = todaysOrders.find(
        d => d.eventCode === BENCH_OPINION_EVENT_CODE,
      );

      expect(foundBenchOpinion).toBeUndefined();
    });
  };
