import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDateFromCalendarAction } from './updateDateFromCalendarAction';
const {
  createISODateString,
} = require('../../../../../shared/src/business/utilities/DateHandler');

describe('updateDateFromCalendarAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUtilities: () => {
        return { createISODateString };
      },
    };
  });

  it('sets only state.filterStartDate to the formatted props.startDate if props.endDate is not passed in', async () => {
    const testDate = new Date('2019-05-14T07:12:12.457Z');

    const result = await runAction(updateDateFromCalendarAction, {
      modules: { presenter },
      props: {
        startDate: testDate,
      },
      state: {},
    });

    expect(result.state.filterStartDate).toEqual('2019-05-14T04:00:00.000Z');
  });

  it('sets state.filterStartDate and state.filterEndDate to the formatted props.startDate and props.endDate if both are passed in', async () => {
    const testStartDate = new Date('2019-05-14T07:12:12.457Z');
    const testEndDate = new Date('2019-05-17T07:12:12.457Z');

    const result = await runAction(updateDateFromCalendarAction, {
      modules: { presenter },
      props: {
        endDate: testEndDate,
        startDate: testStartDate,
      },
      state: {},
    });

    expect(result.state.filterStartDate).toEqual('2019-05-14T04:00:00.000Z');
    expect(result.state.filterEndDate).toEqual('2019-05-17T04:00:00.000Z');
  });
});
