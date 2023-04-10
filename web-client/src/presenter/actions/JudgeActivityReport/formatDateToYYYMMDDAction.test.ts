import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { formatDateToYYYMMDDAction } from './formatDateToYYYMMDDAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('formatDateToYYYMMDDAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should format the date provided in props.value to YYYY-MM-DD', async () => {
    const { output } = await runAction(formatDateToYYYMMDDAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'endDate',
        value: '02/24/2022',
      },
    });

    expect(output.value).toBe('2022-02-24');
  });
});
