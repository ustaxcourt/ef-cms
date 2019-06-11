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
});
