import {
  FILING_TYPES,
  MAX_FILE_SIZE_BYTES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';

describe('UploadPetitionStep2', () => {
  const VALID_ENTITY = {
    filingType: FILING_TYPES[ROLES.petitioner][0],
    partyType: FILING_TYPES[ROLES.petitioner][0],
  };

  it('should create a valid instance of "UploadPetitionStep2" entity', () => {
    const entity = new UploadPetitionStep2(VALID_ENTITY);

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('businessType', () => {
      it('should not return an error message for "businessType" if its undefined and fillingType is not "A business"', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          businessType: undefined,
          filingType: 'Myself',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "businessType" if its undefined and fillingType is "A business"', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          businessType: undefined,
          filingType: 'A business',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toMatchObject({
          businessType: 'Select a business type',
        });
      });

      it('should return an error message for "businessType" if its an invalid choice', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          businessType: 'SOMETHING_RANDOM',
          filingType: 'A business',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toMatchObject({
          businessType: 'Select a business type',
        });
      });
    });

    describe('corporateDisclosureFile', () => {
      it('should not return an error message for "corporateDisclosureFile" if its undefined and fillingType is not "A business"', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          corporateDisclosureFile: undefined,
          filingType: 'Myself',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "corporateDisclosureFile" if its undefined and fillingType is "A business"', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          corporateDisclosureFile: undefined,
          filingType: 'A business',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toMatchObject({
          corporateDisclosureFile: 'Upload a Corporate Disclosure Statement',
        });
      });
    });

    describe('corporateDisclosureFileSize', () => {
      it('should return an error message for "corporateDisclosureFileSize" if its undefined', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          corporateDisclosureFile: {},
          corporateDisclosureFileSize: undefined,
          filingType: 'A business',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toMatchObject({
          corporateDisclosureFileSize:
            'Your Corporate Disclosure Statement file size is empty',
        });
      });

      it('should return an error message for "corporateDisclosureFileSize" if its over the limit', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          corporateDisclosureFile: {},
          corporateDisclosureFileSize: MAX_FILE_SIZE_BYTES + 1,
          filingType: 'A business',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toMatchObject({
          corporateDisclosureFileSize:
            'Your Corporate Disclosure Statement file size is too big. The maximum file size is 250MB.',
        });
      });

      it('should return an error message for "corporateDisclosureFileSize" if its under the minimum', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY,
          corporateDisclosureFile: {},
          corporateDisclosureFileSize: 0,
          filingType: 'A business',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toMatchObject({
          corporateDisclosureFileSize:
            'Your Corporate Disclosure Statement file size is empty',
        });
      });
    });
  });
});
