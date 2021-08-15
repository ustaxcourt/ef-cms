import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);
const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

export const associatedExternalUserViewsCaseDetailForOwnedCase =
  cerebralTest => {
    return it('associated external user views case detail for owned case', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
        cerebralTest.docketNumber,
      );

      const helper = runCompute(caseDetailHelper, {
        state: cerebralTest.getState(),
      });
      expect(helper.showPetitionProcessingAlert).toBeFalsy();

      const headerHelper = runCompute(caseDetailHeaderHelper, {
        state: cerebralTest.getState(),
      });
      expect(headerHelper.showExternalButtons).toBeTruthy();
    });
  };
