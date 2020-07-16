import { caseMessageModalHelper as caseMessageModalHelperComputed } from '../../src/presenter/computeds/caseMessageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseMessageModalHelper = withAppContextDecorator(
  caseMessageModalHelperComputed,
);

export const docketClerkStartsNewCaseMessageWithCorrespondence = test => {
  const getHelper = () => {
    return runCompute(caseMessageModalHelper, {
      state: test.getState(),
    });
  };

  it('docketclerk verifies correspondence is an available document when starting a new case message', async () => {
    await test.runSequence('openCreateCaseMessageModalSequence');

    let helper = getHelper();

    expect(helper.hasCorrespondence).toEqual(true);
    expect(helper.correspondence).toMatchObject([
      expect.objectContaining(test.correspondenceDocument),
    ]);
  });
};
