import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const associatedUserViewsCaseDetailForCaseWithLegacySealedDocument =
  cerebralTest => {
    return it('associated user views case detail for a case with a legacy sealed document', async () => {
      const { formattedDocketEntriesOnDocketRecord } =
        await getFormattedDocketEntriesForTest(cerebralTest);

      const legacySealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
        entry => entry.docketEntryId === cerebralTest.docketEntryId,
      );

      expect(legacySealedDocketEntry.showLinkToDocument).toBeFalsy();

      const formattedCase = runCompute(formattedCaseDetail, {
        state: cerebralTest.getState(),
      });

      expect(formattedCase.petitioners[0]).toMatchObject({
        address1: expect.anything(),
        contactId: expect.anything(),
        name: expect.anything(),
      });
      expect(cerebralTest.getState('screenMetadata.isAssociated')).toBeTruthy();

      await expect(
        cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: cerebralTest.docketEntryId,
          docketNumber: cerebralTest.docketNumber,
          isPublic: false,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
