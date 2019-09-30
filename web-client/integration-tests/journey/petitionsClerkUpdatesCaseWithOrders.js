import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { documentDetailHelper as documentDetailHelperComputed } from '../../src/presenter/computeds/documentDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);
const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
);

export default test => {
  return it('Petitions clerk adds orders to a case', async () => {
    // order for amended petition
    await test.runSequence('updateFormValueSequence', {
      key: 'orderForAmendedPetition',
      value: true,
    });
    await test.runSequence('autoSaveCaseSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    const caseHelper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(caseHelper.hasOrders).toEqual(true);

    const documentHelper = runCompute(documentDetailHelper, {
      state: test.getState(),
    });
    expect(documentHelper.showViewOrdersNeededButton).toEqual(true);
  });
};
