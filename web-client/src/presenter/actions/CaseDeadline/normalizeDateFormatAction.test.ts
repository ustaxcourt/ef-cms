import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { normalizeDateFormatAction } from './normalizeDateFormatAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContextForClient;

describe('normalizeDateFormatAction', () => {
  it('should convert a date selected by the picker to an ISO time string in the east coast', async () => {
    const testDate = '05/14/2019';

    const result = await runAction(normalizeDateFormatAction, {
      modules: { presenter },
      props: {
        date: testDate,
      },
      state: {},
    });

    expect(result.output.date).toEqual('2019-05-14T04:00:00.000Z');
  });
});
