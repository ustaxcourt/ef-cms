import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/business/entities/EntityConstants';
import {
  RawUploadPetitionStep1,
  UploadPetitionStep1,
} from '@shared/business/entities/startCase/UploadPetitionStep1';

describe('UploadPetitionStep1', () => {
  describe('Upload', () => {
    const VALID_ENTITY_UPLOADED: RawUploadPetitionStep1 = {
      acknowledgeChecked: true,
      petitionFile: new File([], 'abc'),
      petitionFileSize: 10,
      petitionFileSource: 'upload',
    };

    it('should create a UploadPetitionStep1 without any errors', () => {
      const entity = new UploadPetitionStep1(VALID_ENTITY_UPLOADED);
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    it('should return an error message for "petitionFile" when undefined is passed', () => {
      const entity = new UploadPetitionStep1({
        ...VALID_ENTITY_UPLOADED,
        petitionFile: undefined,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionFile).toEqual('Upload the Petition PDF.');
    });

    it('should return an error message for "petitionFileSize" when it passes the maximum size', () => {
      const entity = new UploadPetitionStep1({
        ...VALID_ENTITY_UPLOADED,
        petitionFileSize: MAX_FILE_SIZE_BYTES + 100,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionFileSize).toEqual(
        `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should return an error message for "petitionFileSize" when undefined is passed', () => {
      const entity = new UploadPetitionStep1({
        ...VALID_ENTITY_UPLOADED,
        petitionFileSize: undefined,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionFileSize).toEqual(
        'Your Petition file size is empty',
      );
    });

    it('should return an error message for "acknowledgeChecked" when undefined is passed', () => {
      const entity = new UploadPetitionStep1({
        ...VALID_ENTITY_UPLOADED,
        acknowledgeChecked: undefined,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.acknowledgeChecked).toEqual(
        '"acknowledgeChecked" is required',
      );
    });

    it('should return an error message for "acknowledgeChecked" when false is passed', () => {
      const entity = new UploadPetitionStep1({
        ...VALID_ENTITY_UPLOADED,
        acknowledgeChecked: false,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.acknowledgeChecked).toEqual(
        '"acknowledgeChecked" must be [true]',
      );
    });
  });
});
