import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultDateOnCalendarAction } from './setDefaultDateOnCalendarAction';

describe('setDefaultDateOnCalendarAction', () => {
  const currentDate = new Date('2019-05-14T04:00:00.000Z');
  global.Date = class extends Date {
    constructor() {
      return currentDate;
    }
  };

  it('sets today as the default state.calendarStartDate', async () => {
    const result = await runAction(setDefaultDateOnCalendarAction, {
      modules: { presenter },
      state: {},
    });

    expect(result.state.calendarStartDate).toEqual(currentDate);
  });
});
