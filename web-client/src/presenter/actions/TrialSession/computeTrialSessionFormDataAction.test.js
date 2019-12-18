import { computeTrialSessionFormDataAction } from './computeTrialSessionFormDataAction';
import { runAction } from 'cerebral/test';

describe('computeTrialSessionFormDataAction', () => {
  let form;
  const TIME_INVALID = '99:99';

  beforeEach(() => {
    form = {
      month: '12',
      startTimeExtension: 'am',
      startTimeHours: '11',
      startTimeMinutes: '00',
      year: '2019',
    };
  });

  it('should store term and time when provided valid inputs', async () => {
    let result;

    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      startTime: '11:00',
      term: 'Fall',
      termYear: '2019',
    });

    form.month = '5';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      term: 'Spring',
    });

    form.month = '2';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      term: 'Winter',
    });
  });

  it('should store empty term and termYear if month is invalid or year is empty', async () => {
    let result;

    form.month = 'June';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      term: undefined,
      termYear: undefined,
    });

    form.month = '7';
    form.year = '2019';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      term: undefined,
      termYear: '2019',
    });

    form.month = '13';
    form.year = '2019';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      term: undefined,
      termYear: '2019',
    });

    form.month = '5';
    form.year = '';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      term: undefined,
      termYear: undefined,
    });
  });

  it('should store an afternoon (pm) startTime in 24hr format', async () => {
    let result;
    form.startTimeHours = '6';
    form.startTimeMinutes = '15';
    form.startTimeExtension = 'pm';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      startTime: '18:15',
    });
  });

  it('should store an afternoon (pm) startTime in 12hr format if it is 12', async () => {
    let result;
    form.startTimeHours = '12';
    form.startTimeMinutes = '15';
    form.startTimeExtension = 'pm';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      startTime: '12:15',
    });
  });

  it('should store a morning (am) startTime in 24hr format', async () => {
    let result;
    form.startTimeHours = '6';
    form.startTimeMinutes = '15';
    form.startTimeExtension = 'am';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      startTime: '06:15',
    });
  });

  it('should store a midnight startTime in 24hr format', async () => {
    let result;
    form.startTimeHours = '12';
    form.startTimeMinutes = '00';
    form.startTimeExtension = 'am';
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form },
    });
    expect(result.state.form).toMatchObject({
      startTime: '00:00',
    });
  });

  it('should not store a time if hours and minutes are not set', async () => {
    let result;
    result = await runAction(computeTrialSessionFormDataAction, {
      state: { form: {} },
    });
    expect(result.state.startTime).toBeUndefined();
  });

  describe('should store a startTime deliberately created as invalid', () => {
    it('if hours are invalid', async () => {
      let result;

      form.startTimeHours = '13';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeHours = '13';
      form.startTimeExtension = 'pm';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeHours = '0';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeHours = '24';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeHours = undefined;
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeHours = 'abc';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });
    });

    it('if minutes are invalid', async () => {
      let result;

      form.startTimeMinutes = undefined;
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeMinutes = '61';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeMinutes = 'abc';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });
    });

    it('if extension is invalid', async () => {
      let result;

      form.startTimeExtension = undefined;
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });

      form.startTimeExtension = 'abc';
      result = await runAction(computeTrialSessionFormDataAction, {
        state: { form },
      });
      expect(result.state.form).toMatchObject({
        startTime: TIME_INVALID,
      });
    });
  });

  it('should correctly store the judge on the form', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      props: { key: 'judgeId', value: { name: 'Test Judge', userId: '123' } },
      state: { form },
    });
    expect(result.state.form.judgeId).toEqual('123');
    expect(result.state.form.judge).toEqual({
      name: 'Test Judge',
      userId: '123',
    });
  });

  it('should correctly store the trialClerk on the form', async () => {
    const result = await runAction(computeTrialSessionFormDataAction, {
      props: {
        key: 'trialClerkId',
        value: { name: 'Test Clerk', userId: '321' },
      },
      state: { form },
    });
    expect(result.state.form.trialClerkId).toEqual('321');
    expect(result.state.form.trialClerk).toEqual({
      name: 'Test Clerk',
      userId: '321',
    });
  });
});
