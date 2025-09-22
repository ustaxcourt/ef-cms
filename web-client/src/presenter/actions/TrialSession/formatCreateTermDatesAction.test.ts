import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatCreateTermDatesAction } from './formatCreateTermDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

describe('formatCreateTermDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should pass the term start date and the term end date to createISODateString', async () => {
    const TEST_START_DATE = '12/20/2023';
    const TEST_END_DATE = '12/31/2023';

    const result = await runAction(formatCreateTermDatesAction, {
      modules: {
        presenter,
      },
      state: {
        [STATE_KEYS.TERM_BUILDER_INFORMATION]: {
          termEndDate: TEST_END_DATE,
          termName: 'Test Term',
          termStartDate: TEST_START_DATE,
        },
      },
    });

    const EXPECTED_TEST_START_DATE = '2023-12-20';
    const EXPECTED_TEST_END_DATE = '2023-12-31';

    expect(result.output).toEqual({
      termEndDate: EXPECTED_TEST_END_DATE,
      termName: 'Test Term',
      termStartDate: EXPECTED_TEST_START_DATE,
    });
  });
});
