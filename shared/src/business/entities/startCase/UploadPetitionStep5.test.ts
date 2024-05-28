import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/business/entities/EntityConstants';
import {
  RawUploadPetitionStep5,
  UploadPetitionStep5,
} from '@shared/business/entities/startCase/UploadPetitionStep5';

describe('UploadPetitionStep5', () => {
  const VALID_ENTITY: RawUploadPetitionStep5 = {
    stinFile: new File([], 'test.pdf'),
    stinFileSize: 10,
  };

  it('should create a valid instance of "UploadPetitionStep5" entity', () => {
    const entity = new UploadPetitionStep5(VALID_ENTITY);

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('preferredTrialCity', () => {
      it('should return a validation error message for "stinFile" when it is undefined', () => {
        const entity = new UploadPetitionStep5({
          ...VALID_ENTITY,
          stinFile: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          stinFile:
            'Upload a Statement of Taxpayer Identification Number (STIN)',
        });
      });
    });

    describe('stinFileSize', () => {
      it('should return a validation error message for "stinFileSize" when it is undefined', () => {
        const entity = new UploadPetitionStep5({
          ...VALID_ENTITY,
          stinFileSize: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          stinFileSize: 'Your STIN file size is empty',
        });
      });

      it('should return a validation error message for "stinFileSize" when it is under the minimum', () => {
        const entity = new UploadPetitionStep5({
          ...VALID_ENTITY,
          stinFileSize: 0,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          stinFileSize: 'Your STIN file size is empty',
        });
      });

      it('should return a validation error message for "stinFileSize" when it is over the limit', () => {
        const entity = new UploadPetitionStep5({
          ...VALID_ENTITY,
          stinFileSize: MAX_FILE_SIZE_BYTES + 1,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          stinFileSize: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        });
      });
    });
  });
});
