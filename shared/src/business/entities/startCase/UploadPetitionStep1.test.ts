import {
  FILING_TYPES,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';

describe('UploadPetitionStep1', () => {
  const VALID_ENTITY = {
    filingType: FILING_TYPES[ROLES.petitioner][0],
    partyType: PARTY_TYPES.petitioner,
  };

  it('should create a valid instance of "UploadPetitionStep1" entity', () => {
    const entity = new UploadPetitionStep1(VALID_ENTITY);

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  it('should set "contactPrimary" and "contactSecondary" to correct entity', () => {
    const entity = new UploadPetitionStep1({
      ...VALID_ENTITY,
      contactPrimary: {},
      contactSecondary: {},
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
    });

    expect(entity).toBeDefined();
    expect(entity.contactPrimary).toBeDefined();
    expect(entity.contactSecondary).toBeDefined();
  });

  describe('VALIDATION', () => {
    describe('businessType', () => {
      it('should not return an error message for "businessType" if its undefined and fillingType is not "A business"', () => {
        const entity = new UploadPetitionStep1({
          ...VALID_ENTITY,
          businessType: undefined,
          filingType: 'Myself',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "businessType" if its undefined and fillingType is "A business"', () => {
        const entity = new UploadPetitionStep1({
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
        const entity = new UploadPetitionStep1({
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
        const entity = new UploadPetitionStep1({
          ...VALID_ENTITY,
          corporateDisclosureFile: undefined,
          filingType: 'Myself',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "corporateDisclosureFile" if its undefined and fillingType is "A business"', () => {
        const entity = new UploadPetitionStep1({
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
        const entity = new UploadPetitionStep1({
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
        const entity = new UploadPetitionStep1({
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
        const entity = new UploadPetitionStep1({
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

    describe('MODIFICATIONS', () => {
      it('should clear the partyType error message but keep contactPrimary error message if partyType is undefined and filingType is "Myself and my spouse"', () => {
        const entity = new UploadPetitionStep1({
          ...VALID_ENTITY,
          contactPrimary: {},
          filingType: 'Myself and my spouse',
          partyType: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors.contactPrimary).toBeDefined();
        expect(errors.partyType).not.toBeDefined();
      });

      it('should clear the partyType and contactPrimary error message if partyType is undefined and filingType is not "Myself and my spouse"', () => {
        const entity = new UploadPetitionStep1({
          ...VALID_ENTITY,
          contactPrimary: {},
          filingType: 'SOMETHING ELSE',
          partyType: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors.contactPrimary).not.toBeDefined();
        expect(errors.partyType).not.toBeDefined();
      });
    });

    describe('Filing types', () => {
      it('should not return an error message for petitioner filing type', () => {
        const entity = new UploadPetitionStep1(VALID_ENTITY);

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });
      it('should not return an error message for practitioner filing type', () => {
        const entity = new UploadPetitionStep1({
          filingType: FILING_TYPES[ROLES.privatePractitioner][0],
          partyType: PARTY_TYPES.petitioner,
        });
        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });
      it('should return an error message for filing type other than petitioner and practitioner', () => {
        const entity = new UploadPetitionStep1({
          filingType: 'random filing type',
          partyType: PARTY_TYPES.petitioner,
        });
        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          filingType: 'Select on whose behalf you are filing',
        });
      });
    });
  });
});
