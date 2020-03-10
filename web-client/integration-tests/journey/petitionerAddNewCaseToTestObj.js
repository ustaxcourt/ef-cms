import { formattedCases as formattedCasesComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCases = withAppContextDecorator(formattedCasesComputed);

export default test => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', () => {
    if (!Array.isArray(test.petitionerNewCases)) {
      test.petitionerNewCases = [];
    }
    const formatted = runCompute(formattedCases, {
      state: test.getState(),
    });
    const petitionerNewCase = formatted[0];
    test.petitionerNewCases.push(petitionerNewCase);
    expect(test.petitionerNewCases.length).toBeGreaterThan(0);
  });
};
