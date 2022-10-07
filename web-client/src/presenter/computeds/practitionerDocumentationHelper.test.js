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

  describe('showDocumentationTab', () => {
    it('should return true for showDocumentationTab if user has UPLOAD_PRACTITIONER_DOCUMENT permissions', () => {
      const { showDocumentationTab } = runCompute(
        practitionerDocumentationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
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
            user: { role: 'admissionsclerk' },
          },
        },
      );
      expect(showDocumentationTab).toBe(false);
    });
  });

  describe('isCertificateOfGoodStanding', () => {
    it('should return true for isCertificateOfGoodStanding if documentationCategory equals "Certificate of Good Standing"', () => {
      const { isCertificateOfGoodStanding } = runCompute(
        practitionerDocumentationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            screenMetadata: {
              documentationCategoryDropdown: {
                documentationCategory: 'Certificate of Good Standing',
              },
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(true);
    });

    it('should return false for isCertificateOfGoodStanding if documentationCategory equals "Certificate of Good Standing"', () => {
      const { isCertificateOfGoodStanding } = runCompute(
        practitionerDocumentationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            screenMetadata: {
              documentationCategoryDropdown: {
                documentationCategory: 'Application',
              },
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(false);
    });

    it('should return false for isCertificateOfGoodStanding if documentationCategory is undefined', () => {
      const { isCertificateOfGoodStanding } = runCompute(
        practitionerDocumentationHelper,
        {
          state: {
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
            screenMetadata: {
              documentationCategoryDropdown: {
                documentationCategory: undefined,
              },
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(false);
    });
  });
});
