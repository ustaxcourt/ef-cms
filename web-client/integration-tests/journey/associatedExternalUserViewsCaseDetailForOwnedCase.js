import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);
const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

export const associatedExternalUserViewsCaseDetailForOwnedCase = test => {
  return it('associated external user views case detail for owned case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.showPetitionProcessingAlert).toBeFalsy();

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: test.getState(),
    });
    expect(headerHelper.showExternalButtons).toBeTruthy();
  });
};
