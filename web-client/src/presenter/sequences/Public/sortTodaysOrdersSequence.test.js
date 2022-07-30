import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { sortTodaysOrdersSequence } from './sortTodaysOrdersSequence';

describe('sortTodaysOrdersSequence', () => {
  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      sortTodaysOrdersSequence,
    };
    cerebralTest = CerebralTest(presenter);
    applicationContext.getUseCases().getTodaysOrdersInteractor.mockReturnValue({
      results: ['newly', 'sorted', 'results'],
      totalCount: 3,
    });
  });

  it('should always unset page number before requesting search results', async () => {
    cerebralTest.setState('sessionMetadata.todaysOrdersSort', {
      todaysOrdersSort: 'filingDateDesc',
    });
    cerebralTest.setState('todaysOrders', {
      page: 7,
      results: ['some', 'results'],
    });

    await cerebralTest.runSequence('sortTodaysOrdersSequence', {
      key: 'todaysOrdersSort',
      value: 'filingDate',
    });

    expect(cerebralTest.getState('sessionMetadata.todaysOrdersSort')).toBe(
      'filingDate',
    );
    expect(
      applicationContext.getUseCases().getTodaysOrdersInteractor.mock
        .calls[0][1],
    ).toEqual({
      page: 1,
      todaysOrdersSort: 'filingDate',
    });
    expect(cerebralTest.getState('todaysOrders')).toMatchObject({
      page: 2,
      results: ['newly', 'sorted', 'results'],
    });
  });
});
