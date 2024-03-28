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

    expect(result.state.stepIndicatorInfo.currentStep).toEqual(0);
    expect(result.state.stepIndicatorInfo.steps).toEqual([
      'Petition',
      'Petitioner Information',
      'IRS Notice',
      'Case Procedure & Trial Location',
      'Statement of Taxpayer Identification',
      'Review & Submit Case',
      'Pay Filing Fee',
    ]);
  });
});
