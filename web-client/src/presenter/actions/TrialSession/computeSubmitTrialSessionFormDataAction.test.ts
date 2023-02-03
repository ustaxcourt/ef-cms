import * as computeFile from './computeTrialSessionFormDataAction';
import { computeSubmitTrialSessionDataAction } from './computeSubmitTrialSessionDataAction';
import { runAction } from 'cerebral/test';

describe('computeSubmitTrialSessionDataAction', () => {
  let form = {};
  const trialClerk = { name: 'Test Clerk', userId: '321' };
  let spyCompute24HrTimeAndUpdateState, spyComputeTermAndUpdateState;

  beforeAll(() => {
    spyCompute24HrTimeAndUpdateState = jest.spyOn(
      computeFile,
      'compute24HrTimeAndUpdateState',
    );
    spyComputeTermAndUpdateState = jest.spyOn(
      computeFile,
      'computeTermAndUpdateState',
    );
  });

  it('should call computeTermAndUpdateState', () => {
    runAction(computeSubmitTrialSessionDataAction, {
      state: { form },
    });

    expect(spyCompute24HrTimeAndUpdateState).toHaveBeenCalled();
    expect(spyComputeTermAndUpdateState).toHaveBeenCalled();
  });

  it('should clear trialClerkId and trialClerk when alternateTrialClerkName is present', async () => {
    const alternateTrialClerkName = 'Wonder Woman';
    const result = await runAction(computeSubmitTrialSessionDataAction, {
      state: {
        form: {
          ...form,
          alternateTrialClerkName,
          trialClerk,
          trialClerkId: 'Other',
        },
      },
    });
    expect(result.state.form.trialClerkId).toEqual(undefined);
    expect(result.state.form.trialClerk).toEqual(undefined);
    expect(result.state.form.alternateTrialClerkName).toEqual(
      alternateTrialClerkName,
    );
  });

  it('should NOT clear trialClerkId and trialClerk when alternateTrialClerkName is not present', async () => {
    const result = await runAction(computeSubmitTrialSessionDataAction, {
      state: {
        form: {
          ...form,
          trialClerk,
          trialClerkId: '12',
        },
      },
    });
    expect(result.state.form.trialClerkId).toEqual('12');
    expect(result.state.form.trialClerk).toEqual(trialClerk);
  });
});
