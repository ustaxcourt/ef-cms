import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { practitionerDocumentationFormHelper as practitionerDocumentationFormHelperComputed } from './practitionerDocumentationFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
              categoryType:
                PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
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
              categoryType: PRACTITIONER_DOCUMENT_TYPES_MAP.APPLICATION,
            },
            permissions: {
              UPLOAD_PRACTITIONER_DOCUMENT: true,
            },
          },
        },
      );
      expect(isCertificateOfGoodStanding).toBe(false);
    });

    it('should return false for isCertificateOfGoodStanding if categoryType is undefined', () => {
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
