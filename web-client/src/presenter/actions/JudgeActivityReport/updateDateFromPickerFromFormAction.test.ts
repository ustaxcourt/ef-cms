import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDateFromPickerFromFormAction } from './updateDateFromPickerFromFormAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('updateDateFromPickerFromFormAction', () => {
  it('should set only state.form.startDate to the formatted props.startDate if props.endDate is not passed in', async () => {
    const testDate = '2019-05-14';

    const result = await runAction(updateDateFromPickerFromFormAction, {
      modules: { presenter },
      props: {
        startDate: testDate,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.startDate).toEqual(testDate);
  });

  it('should unset state.form.startDate when formatted props.startDate is an empty string', async () => {
    const result = await runAction(updateDateFromPickerFromFormAction, {
      modules: { presenter },
      props: {
        startDate: '',
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.startDate).toBeUndefined();
  });

  it('sets state.form.startDate and state.form.endDate to the formatted props.startDate and props.endDate if both are passed in', async () => {
    const testStartDate = '2019-05-14';
    const testEndDate = '2019-05-17';

    const result = await runAction(updateDateFromPickerFromFormAction, {
      modules: { presenter },
      props: {
        endDate: testEndDate,
        startDate: testStartDate,
      },
      state: { form: {} },
    });

    expect(result.state.form.startDate).toEqual(testStartDate);
    expect(result.state.form.endDate).toEqual(testEndDate);
  });

  it('should unset state.form.endDate when formatted props.endDate is an empty string', async () => {
    const result = await runAction(updateDateFromPickerFromFormAction, {
      modules: { presenter },
      props: {
        endDate: '',
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.endDate).toBeUndefined();
  });
});
