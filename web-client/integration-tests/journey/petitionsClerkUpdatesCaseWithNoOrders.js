import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { documentDetailHelper as documentDetailHelperComputed } from '../../src/presenter/computeds/documentDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);
const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
);

export default test => {
  return it('Petitions clerk removes orders from a case', async () => {
    // order for designating place of trial = false
    await test.runSequence('updateFormValueSequence', {
      key: 'orderDesignatingPlaceOfTrial',
      value: false,
    });
    await test.runSequence('autoSaveCaseSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    console.log('caseDetail', test.getState('caseDetail'));

    const caseHelper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(caseHelper.hasOrders).toEqual(false);

    const documentHelper = runCompute(documentDetailHelper, {
      state: test.getState(),
    });

    const showButton =
      documentHelper.showViewOrdersNeededButton && caseHelper.hasOrders;

    expect(showButton).toEqual(true);
  });
};
