import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { paperDocketEntryHelper as paperDocketEntryHelperComputed } from './paperDocketEntryHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

describe('paperDocketEntryHelper', () => {
  const mockDocketEntryId = '3db0329d-e0ae-4cf7-8416-509818e5d92f';

  const paperDocketEntryHelper = withAppContextDecorator(
    paperDocketEntryHelperComputed,
    applicationContext,
  );

  describe('showAddDocumentWarning', () => {
    it('should be false when the user is not editing a docket entry', () => {
      const result = runCompute(paperDocketEntryHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                isFileAttached: false,
              },
            ],
          },
          currentViewMetadata: {
            documentUploadMode: 'preview',
          },
          docketEntryId: mockDocketEntryId,
          isEditingDocketEntry: false,
        },
      });

      expect(result.showAddDocumentWarning).toBe(false);
    });

    it('should be false when the user is editing a docket entry that was not found in the list of case documents', () => {
      const result = runCompute(paperDocketEntryHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [],
          },
          currentViewMetadata: {
            documentUploadMode: 'scan',
          },
          isEditingDocketEntry: false,
        },
      });

      expect(result.showAddDocumentWarning).toBeFalsy();
    });

    it('should be false when the user is editing a docket entry with an attached file but the document upload mode is not preview', () => {
      const result = runCompute(paperDocketEntryHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                isFileAttached: true,
              },
            ],
          },
          currentViewMetadata: {
            documentUploadMode: 'scan',
          },
          docketEntryId: mockDocketEntryId,
          isEditingDocketEntry: true,
        },
      });

      expect(result.showAddDocumentWarning).toBe(false);
    });

    it('should be true when the user is editing a docket entry that does not have a file attached and document upload mode is preview', () => {
      const result = runCompute(paperDocketEntryHelper, {
        state: {
          caseDetail: {
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                isFileAttached: false,
              },
            ],
          },
          currentViewMetadata: {
            documentUploadMode: 'preview',
          },
          docketEntryId: mockDocketEntryId,
          isEditingDocketEntry: true,
        },
      });

      expect(result.showAddDocumentWarning).toBe(true);
    });
  });

  describe('canAllowDocumentServiceForCase', () => {
    it('should make a call to a utility function to determine if documents can be served on the case', () => {
      const { canAllowDocumentServiceForCase } = runCompute(
        paperDocketEntryHelper,
        {
          state: {
            caseDetail: {
              correspondence: [],
              docketEntries: [],
            },
          },
        },
      );

      expect(canAllowDocumentServiceForCase).toBeDefined();
      expect(
        applicationContext.getUtilities().canAllowDocumentServiceForCase,
      ).toHaveBeenCalled();
    });
  });
});
