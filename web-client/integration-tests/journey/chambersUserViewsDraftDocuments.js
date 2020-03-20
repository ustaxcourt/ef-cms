import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const chambersUserViewsDraftDocuments = (test, count = 0) => {
  return it('Chambers user views draft documents', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.draftDocuments.length).toEqual(count);
  });
};
