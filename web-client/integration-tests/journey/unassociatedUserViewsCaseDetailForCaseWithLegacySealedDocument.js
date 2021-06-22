import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument =
  test => {
    return it('unassociated user views case detail for a case with a legacy sealed document', async () => {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });

      const formattedCase = runCompute(formattedCaseDetail, {
        state: test.getState(),
      });

      expect(formattedCase.docketEntries).toEqual([]);

      await expect(
        test.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: test.docketEntryId,
          docketNumber: test.docketNumber,
          isPublic: false,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
