import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkViewsDraftDocumentsForNotice = (
  cerebralTest,
  count = 0,
) => {
  return it('Petitions clerk views Draft Documents for a signed notice', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.draftDocuments.length).toEqual(count);
    expect(formatted.draftDocuments[0].signedAt).toBeTruthy();
  });
};
