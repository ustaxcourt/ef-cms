import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkViewsDraftDocumentsForNotice = (test, count = 0) => {
  return it('Petitions clerk views Draft Documents for a signed notice', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    console.log('0-0-0-0-0-0', formatted.draftDocuments[0]);

    expect(formatted.draftDocuments.length).toEqual(count);
    expect(formatted.draftDocuments[0].signedAt).toBeTruthy();
  });
};
