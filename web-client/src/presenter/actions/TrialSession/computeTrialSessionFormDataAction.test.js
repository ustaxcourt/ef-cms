import { computeTrialSessionFormDataAction } from './computeTrialSessionFormDataAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('computeTrialSessionFormDataAction', () => {
  it('sets term and term year when month is in Winter term and year is set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          month: '1',
          year: '2019',
        },
      },
    });
    expect(result.state.form.term).toEqual('Winter');
    expect(result.state.form.termYear).toEqual('2019');
  });

  it('sets term and term year when month is in Spring term and year is set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          month: '5',
          year: '2019',
        },
      },
    });
    expect(result.state.form.term).toEqual('Spring');
    expect(result.state.form.termYear).toEqual('2019');
  });

  it('sets term and term year when month is in Fall term and year is set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          month: '11',
          year: '2019',
        },
      },
    });
    expect(result.state.form.term).toEqual('Fall');
    expect(result.state.form.termYear).toEqual('2019');
  });

  it('sets term but not term year when month is set but year is not set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          month: '11',
        },
      },
    });
    expect(result.state.form.term).toEqual('Fall');
    expect(result.state.form.termYear).toBeUndefined();
  });

  it('does not set term or term year when month and year are not set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });
    expect(result.state.form.term).toBeUndefined();
    expect(result.state.form.termYear).toBeUndefined();
  });

  it('does not set term if month is not part of any term', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: { month: '8' },
      },
    });
    expect(result.state.form.term).toBeUndefined();
    expect(result.state.form.termYear).toBeUndefined();
  });
  /*
  it('unsets term and term year if month and year are cleared', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: { month: '', term: 'Winter', termYear: '2019', year: '' },
      },
    });
    expect(result.state.form.term).toBeUndefined();
    expect(result.state.form.termYear).toEqual('');
  });

  it('sets startTime and defaults to 00 minutes if only startTimeHours and startTimeExtension are set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: { startTimeExtension: 'am', startTimeHours: '10' },
      },
    });
    expect(result.state.form.startTime).toEqual('10:00');
  });

  it('sets startTime if startTimeHours, startTimeMinutes, and startTimeExtension are all set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          startTimeExtension: 'am',
          startTimeHours: '10',
          startTimeMinutes: '30',
        },
      },
    });
    expect(result.state.form.startTime).toEqual('10:30');
  });

  it('sets correct startTime in military time if startTimeExtension is pm', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          startTimeExtension: 'pm',
          startTimeHours: '1',
          startTimeMinutes: '30',
        },
      },
    });
    expect(result.state.form.startTime).toEqual('13:30');
  });

  it('pads startTimeHours with a 0 if it is less than 10', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          startTimeExtension: 'am',
          startTimeHours: '9',
        },
      },
    });
    expect(result.state.form.startTime).toEqual('09:00');
  });

  it('pads startTimeMinutes with a 0 if it is less than 10', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          startTimeExtension: 'am',
          startTimeHours: '9',
          startTimeMinutes: '5',
        },
      },
    });
    expect(result.state.form.startTime).toEqual('09:05');
  });

  it('does not set startTime if startTimeExtension is not set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          startTimeHours: '1',
          startTimeMinutes: '30',
        },
      },
    });
    expect(result.state.form.startTime).toBeUndefined();
  });

  it('does not set startTime if startTimeHours is not set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          startTimeExtension: 'pm',
          startTimeMinutes: '30',
        },
      },
    });
    expect(result.state.form.startTime).toBeUndefined();
  });

  it('does not set startTime if no time fields are set', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });
    expect(result.state.form.startTime).toBeUndefined();
  });*/
});
