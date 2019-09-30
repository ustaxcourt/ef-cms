import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export default test => {
  return it('Petitions clerk adds an order', async () => {
    // order for amended petition
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForAmendedPetition',
      value: true,
    });
    await test.runSequence('autoSaveCaseSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helper.hasOrders).toEqual(true);
  });
};
