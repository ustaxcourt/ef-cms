import { DateTime } from 'luxon';
import { getStartOfCurrentQuarter } from './list-users-with-expired-credentials';

describe('getStartOfCurrentQuarter', () => {
  it('determines the start of the quarter for the provided DateTime object', () => {
    const jan = DateTime.fromObject({ month: 1, year: DateTime.now().year });
    let startOfQuarter = getStartOfCurrentQuarter(jan);
    expect(startOfQuarter.month).toEqual(1);

    const feb = DateTime.fromObject({ month: 2, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(feb);
    expect(startOfQuarter.month).toEqual(1);

    const mar = DateTime.fromObject({ month: 3, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(mar);
    expect(startOfQuarter.month).toEqual(1);

    const apr = DateTime.fromObject({ month: 4, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(apr);
    expect(startOfQuarter.month).toEqual(4);

    const may = DateTime.fromObject({ month: 5, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(may);
    expect(startOfQuarter.month).toEqual(4);

    const jun = DateTime.fromObject({ month: 6, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(jun);
    expect(startOfQuarter.month).toEqual(4);

    const jul = DateTime.fromObject({ month: 7, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(jul);
    expect(startOfQuarter.month).toEqual(7);

    const aug = DateTime.fromObject({ month: 8, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(aug);
    expect(startOfQuarter.month).toEqual(7);

    const sep = DateTime.fromObject({ month: 9, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(sep);
    expect(startOfQuarter.month).toEqual(7);

    const oct = DateTime.fromObject({ month: 10, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(oct);
    expect(startOfQuarter.month).toEqual(10);

    const nov = DateTime.fromObject({ month: 11, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(nov);
    expect(startOfQuarter.month).toEqual(10);

    const dec = DateTime.fromObject({ month: 12, year: DateTime.now().year });
    startOfQuarter = getStartOfCurrentQuarter(dec);
    expect(startOfQuarter.month).toEqual(10);
  });
});
