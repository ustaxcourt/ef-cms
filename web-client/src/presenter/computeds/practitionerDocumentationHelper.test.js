import { applicationContext } from '../../applicationContext';
import { practitionerDocumentationHelper as practitionerDocumentationHelperComputed } from './practitionerDocumentationHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('practitionerDetailHelper', () => {
  const practitionerDocumentationHelper = withAppContextDecorator(
    practitionerDocumentationHelperComputed,
    {
      ...applicationContext,
    },
  );

  const mockPractitionerDocuments = [
    {
      categoryName: 'Certificate of Good Standing - Colorado',
      categoryType: 'Certificate of Good Standing',
      description: 'test',
      entityName: 'Document',
      fileName: 'test_file.pdf',
      location: 'Colorado',
      practitionerDocumentFileId: '18525e5b-c336-479d-a854-1712432ab8ba',
      uploadDate: '2022-10-11T21:58:40.729Z',
    },
    {
      categoryName: 'Application',
      categoryType: 'Application',
      description: 'test',
      entityName: 'Document',
      fileName: 'test_file.docx',
      practitionerDocumentFileId: '3b7df133-4340-4d58-8553-65da9f7f52ea',
      uploadDate: '2022-10-11T20:01:56.920Z',
    },
    {
      categoryName: 'Admission Certificate',
      categoryType: 'Admission Certificate',
      description: 'test',
      entityName: 'Document',
      fileName: 'Case_Inventory_Report.pdf.1.png',
      practitionerDocumentFileId: 'c58dcf54-6be7-48b2-a129-6ec20e6a0a73',
      uploadDate: '2022-10-11T22:24:30.010Z',
    },
  ];

  describe('showDocumentationTab', () => {
    it('should return true for showDocumentationTab if user has UPLOAD_PRACTITIONER_DOCUMENT permissions', () => {
      const { showDocumentationTab } = runCompute(
        practitionerDocumentationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            practitionerDocuments: [],
            user: { role: 'admissionsclerk' },
          },
        },
      );
      expect(showDocumentationTab).toBe(true);
    });

    it('should return false for showDocumentationTab if user does not have UPLOAD_PRACTITIONER_DOCUMENT permissions', () => {
      const { showDocumentationTab } = runCompute(
        practitionerDocumentationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: false,
            },
            practitionerDocuments: [],
            user: { role: 'admissionsclerk' },
          },
        },
      );
      expect(showDocumentationTab).toBe(false);
    });
  });

  describe('formattedPractitionerDocuments', () => {
    it('should correctly format upload date to "MMDDYY"', () => {
      const results = runCompute(practitionerDocumentationHelper, {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: false,
          },
          practitionerDocuments: [mockPractitionerDocuments[0]],
          user: { role: 'admissionsclerk' },
        },
      });
      expect(
        results.formattedPractitionerDocuments[0].formattedUploadDate,
      ).toEqual('10/11/22');
    });
  });

  describe('practitionerDocumentsCount', () => {
    it('should return the count of practitioner documents that have been uploaded', () => {
      const results = runCompute(practitionerDocumentationHelper, {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: false,
          },
          practitionerDocuments: mockPractitionerDocuments,
          user: { role: 'admissionsclerk' },
        },
      });

      expect(results.practitionerDocumentsCount).toEqual(
        mockPractitionerDocuments.length,
      );
    });

    it('should return 0 if no practitioner documents that have been uploaded', () => {
      const results = runCompute(practitionerDocumentationHelper, {
        state: {
          permissions: {
            UPLOAD_PRACTITIONER_DOCUMENT: false,
          },
          practitionerDocuments: [],
          user: { role: 'admissionsclerk' },
        },
      });

      expect(results.practitionerDocumentsCount).toEqual(0);
    });
  });
});
