import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateDateFromPickerAction } from './updateDateFromPickerAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('updateDateFromPickerAction', () => {
  it('sets only state.screenMetadata.filterStartDate to the formatted props.startDate if props.endDate is not passed in', async () => {
    const testDate = '2019-05-14';

    const result = await runAction(updateDateFromPickerAction, {
      modules: { presenter },
      props: {
        startDate: testDate,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(result.state.screenMetadata.filterStartDateState).toEqual(
      '2019-05-14',
    );
  });

  it('sets state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate to the formatted props.startDate and props.endDate if both are passed in', async () => {
    const testStartDate = '2019-05-14';
    const testEndDate = '2019-05-17';

    const result = await runAction(updateDateFromPickerAction, {
      modules: { presenter },
      props: {
        endDate: testEndDate,
        startDate: testStartDate,
      },
      state: { screenMetadata: {} },
    });

    expect(result.state.screenMetadata.filterStartDateState).toEqual(
      '2019-05-14',
    );
    expect(result.state.screenMetadata.filterEndDateState).toEqual(
      '2019-05-17',
    );
  });
});
