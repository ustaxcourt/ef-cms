import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatCreateTermDatesAction } from './formatCreateTermDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatCreateTermDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should pass the term start date and the term end date to createISODateString', async () => {
    const result = await runAction(formatCreateTermDatesAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          termEndDate: '03/31/2050',
          termName: 'Test Term',
          termStartDate: '01/01/2050',
        },
      },
    });

    expect(
      applicationContext.getUtilities().createISODateString,
    ).toHaveBeenCalledTimes(2);

    expect(result.output).toEqual({
      termEndDate: '2050-03-31T04:00:00.000Z',
      termName: 'Test Term',
      termStartDate: '2050-01-01T05:00:00.000Z',
    });
  });
});
