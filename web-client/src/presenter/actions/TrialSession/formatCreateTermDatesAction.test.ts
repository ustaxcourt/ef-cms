import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatCreateTermDatesAction } from './formatCreateTermDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';

describe('formatCreateTermDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should pass the term start date and the term end date to createISODateString', async () => {
    const TEST_START_DATE = '01/01/2050';
    const TEST_END_DATE = '03/31/2050';

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

    const createISODateStringCalls = (
      applicationContext.getUtilities().createISODateString as jest.Mock
    ).mock.calls;

    expect(createISODateStringCalls.length).toEqual(2);
    expect(createISODateStringCalls[0]).toEqual([
      TEST_START_DATE,
      FORMATS.MMDDYYYY,
    ]);
    expect(createISODateStringCalls[1]).toEqual([
      TEST_END_DATE,
      FORMATS.MMDDYYYY,
    ]);

    expect(result.output).toEqual({
      termEndDate: '2050-03-31T04:00:00.000Z',
      termName: 'Test Term',
      termStartDate: '2050-01-01T05:00:00.000Z',
    });
  });
});
