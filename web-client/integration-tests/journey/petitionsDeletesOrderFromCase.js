import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export default test => {
  return it('Petitions clerk deletes Order from case', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    test.setState('archiveDraftDocument', draftOrder);

    await test.runSequence('archiveDraftDocumentSequence');
  });
};
