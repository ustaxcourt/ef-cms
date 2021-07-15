import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument =
  cerebralTest => {
    return it('unassociated user views case detail for a case with a legacy sealed document', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const formattedCase = runCompute(formattedCaseDetail, {
        state: cerebralTest.getState(),
      });

      expect(formattedCase.docketEntries).toEqual([]);

      await expect(
        cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: cerebralTest.docketEntryId,
          docketNumber: cerebralTest.docketNumber,
          isPublic: false,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
