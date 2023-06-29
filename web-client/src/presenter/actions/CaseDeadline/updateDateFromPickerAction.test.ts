import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDateFromPickerAction } from './updateDateFromPickerAction';

describe('updateDateFromPickerAction', () => {
  it('should unset state.screenMetadata.filterStartDateState when props.startDate is an empty string', async () => {
    const result = await runAction(updateDateFromPickerAction, {
      modules: { presenter },
      props: {
        startDate: '',
      },
      state: {
        screenMetadata: {
          filterStartDateState: 'anything',
        },
      },
    });

    expect(result.state.screenMetadata.filterStartDateState).toEqual(undefined);
  });

  it('should unset state.screenMetadata.filterEndDateState when props.endDate is an empty string', async () => {
    const result = await runAction(updateDateFromPickerAction, {
      modules: { presenter },
      props: {
        endDate: '',
      },
      state: {
        screenMetadata: {
          filterEndDateState: 'anything',
        },
      },
    });

    expect(result.state.screenMetadata.filterEndDateState).toEqual(undefined);
  });

  it('should set state.screenMetadata.filterStartDate and state.screenMetadata.filterEndDate to the formatted props.startDate and props.endDate if both are passed in', async () => {
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
