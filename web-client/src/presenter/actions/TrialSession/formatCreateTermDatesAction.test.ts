import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatCreateTermDatesAction } from './formatCreateTermDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import {
  createISODateString,
  FORMATS,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';

describe('formatCreateTermDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should pass the term start date and the term end date to createISODateString', async () => {
    const TEST_START_DATE = getBusinessDateInFuture({
      numberOfDays: 1,
      outputFormat: FORMATS.MMDDYYYY,
      startDate: createISODateString(),
    });
    const TEST_END_DATE = getBusinessDateInFuture({
      numberOfDays: 360,
      outputFormat: FORMATS.MMDDYYYY,
      startDate: createISODateString(),
    });

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

    const EXPECTED_TEST_START_DATE = createISODateString(
      TEST_START_DATE,
      FORMATS.MMDDYY,
    );
    const EXPECTED_TEST_END_DATE = createISODateString(
      TEST_END_DATE,
      FORMATS.MMDDYY,
    );

    expect(result.output).toEqual({
      termEndDate: EXPECTED_TEST_END_DATE,
      termName: 'Test Term',
      termStartDate: EXPECTED_TEST_START_DATE,
    });
  });
});
