import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { sortTodaysOrdersSequence } from './sortTodaysOrdersSequence';

describe('sortTodaysOrdersSequence', () => {
  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      sortTodaysOrdersSequence,
    };

    applicationContext.getUseCases().getTodaysOrdersInteractor.mockReturnValue({
      results: ['newly', 'sorted', 'results'],
      totalCount: 3,
    });

    cerebralTest = CerebralTest(presenter);
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
      applicationContext.getUseCases().getTodaysOrdersInteractor,
    ).toHaveBeenCalledWith(
      { context: expect.anything() },
      {
        page: 1,
        todaysOrdersSort: 'filingDate',
      },
    );
    expect(cerebralTest.getState('todaysOrders')).toMatchObject({
      page: 2,
      results: ['newly', 'sorted', 'results'],
    });
  });
});
