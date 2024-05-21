import { runAction } from '@web-client/presenter/test.cerebral';
import { setStepIndicatorInfoForPetitionGeneratorAction } from './setStepIndicatorInfoForPetitionGeneratorAction';

describe('setStepIndicatorInfoForPetitionGeneratorAction,', () => {
  it('should set stepIndicator state petition generation', async () => {
    const result = await runAction(
      setStepIndicatorInfoForPetitionGeneratorAction,
      {
        state: {},
      },
    );

    expect(result.state.stepIndicatorInfo.currentStep).toEqual(1);
    expect(result.state.stepIndicatorInfo.steps).toEqual({
      1: 'Petition',
      2: 'Petitioner Information',
      3: 'IRS Notice',
      4: 'Case Procedure & Trial Location',
      5: 'Statement of Taxpayer Identification',
      6: 'Review & Submit Case',
      7: 'Pay Filing Fee',
    });
  });
});
