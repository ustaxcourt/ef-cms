import { applicationContext } from '../../applicationContext';
import { practitionerDocumentationFormHelper as practitionerDocumentationFormHelperComputed } from './practitionerDocumentationFormHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('practitionerDocumentationFormHelper', () => {
  const practitionerDocumentationFormHelper = withAppContextDecorator(
    practitionerDocumentationFormHelperComputed,
    {
      ...applicationContext,
    },
  );

  describe('isCertificateOfGoodStanding', () => {
    it('should return true for isCertificateOfGoodStanding if documentationCategory equals "Certificate of Good Standing"', () => {
      const { isCertificateOfGoodStanding } = runCompute(
        practitionerDocumentationFormHelper,
        {
          state: {
            form: {
              categoryType: 'Certificate of Good Standing',
            },
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(true);
    });

    it('should return false for isCertificateOfGoodStanding if documentationCategory equals "Certificate of Good Standing"', () => {
      const { isCertificateOfGoodStanding } = runCompute(
        practitionerDocumentationFormHelper,
        {
          state: {
            form: {
              categoryType: 'Application',
            },
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(false);
    });

    it('should return false for isCertificateOfGoodStanding if documentationCategory is undefined', () => {
      const { isCertificateOfGoodStanding } = runCompute(
        practitionerDocumentationFormHelper,
        {
          state: {
            form: {
              categoryType: undefined,
            },
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(false);
    });
  });
});
