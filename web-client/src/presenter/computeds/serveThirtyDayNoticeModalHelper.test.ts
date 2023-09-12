import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '../test.cerebral';
import { serveThirtyDayNoticeModalHelper as serveThirtyDayNoticeModalHelperComputed } from './serveThirtyDayNoticeModalHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('serveThirtyDayNoticeModalHelper', () => {
  const thirtyDayNoticeModalHelper = withAppContextDecorator(
    serveThirtyDayNoticeModalHelperComputed,
    applicationContext,
  );

  it('should return the trial session start date formatted as `mm/dd/yy`', () => {
    const mockStartDate = '2025-03-03T05:00:00.000Z';

    const { formattedStartDate } = runCompute(thirtyDayNoticeModalHelper, {
      state: {
        trialSession: {
          startDate: mockStartDate,
        },
      },
    });

    expect(formattedStartDate).toBe('03/03/25');
  });
});
