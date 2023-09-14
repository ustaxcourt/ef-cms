import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatDateAction } from './formatDateAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatDateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return formatted date as `YYYY-MM-DD` when passed a date', async () => {
    const { output } = await runAction(formatDateAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'finalBriefDueDate',
        value: '08/29/2023',
      },
    });

    expect(output).toEqual({
      key: 'finalBriefDueDate',
      value: '2023-08-29',
    });
  });

  it('should not attempt to format an empty string when the date has been cleared', async () => {
    const { output } = await runAction(formatDateAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'finalBriefDueDate',
        value: '',
      },
    });

    expect(output).toEqual(undefined);
  });
});
