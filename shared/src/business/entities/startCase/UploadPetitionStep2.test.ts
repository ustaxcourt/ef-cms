import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  PETITION_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  RawUploadPetitionStep2,
  UploadPetitionStep2,
} from '@shared/business/entities/startCase/UploadPetitionStep2';

describe('UploadPetitionStep2', () => {
  describe('Upload', () => {
    const VALID_ENTITY_UPLOADED: RawUploadPetitionStep2 = {
      petitionFacts: undefined,
      petitionFile: new File([], 'abc'),
      petitionFileSize: 10,
      petitionReasons: undefined,
      petitionRedactionAcknowledgement: true,
      petitionType: PETITION_TYPES.userUploaded,
    };

    it('should create a UploadPetitionStep2 without any errors', () => {
      const entity = new UploadPetitionStep2(VALID_ENTITY_UPLOADED);
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    it('should return an error message for "petitionFile" when undefined is passed', () => {
      const entity = new UploadPetitionStep2({
        ...VALID_ENTITY_UPLOADED,
        petitionFile: undefined,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionFile).toEqual('Upload the Petition PDF');
    });

    it('should return an error message for "petitionFileSize" when it passes the maximum size', () => {
      const entity = new UploadPetitionStep2({
        ...VALID_ENTITY_UPLOADED,
        petitionFileSize: MAX_FILE_SIZE_BYTES + 100,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionFileSize).toEqual(
        `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      );
    });

    it('should return an error message for "petitionFileSize" when undefined is passed', () => {
      const entity = new UploadPetitionStep2({
        ...VALID_ENTITY_UPLOADED,
        petitionFileSize: undefined,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionFileSize).toEqual(
        'Your Petition file size is empty',
      );
    });

    it('should return an error message for "petitionRedactionAcknowledgement" when undefined is passed', () => {
      const entity = new UploadPetitionStep2({
        ...VALID_ENTITY_UPLOADED,
        petitionRedactionAcknowledgement: undefined,
      });
      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionRedactionAcknowledgement).toEqual(
        '"petitionRedactionAcknowledgement" is required',
      );
    });

    it('should return an error message for "petitionRedactionAcknowledgement" when false is passed', () => {
      const entity = new UploadPetitionStep2({
        ...VALID_ENTITY_UPLOADED,
        petitionRedactionAcknowledgement: false,
      });

      const errors = entity.getFormattedValidationErrors()!;
      expect(errors.petitionRedactionAcknowledgement).toEqual(
        '"petitionRedactionAcknowledgement" must be [true]',
      );
    });
  });

  describe('Generated', () => {
    const VALID_ENTITY_GENERATED: RawUploadPetitionStep2 = {
      petitionFacts: ['FACT#1'],
      petitionFile: undefined,
      petitionFileSize: undefined,
      petitionReasons: ['REASON#1'],
      petitionRedactionAcknowledgement: undefined,
      petitionType: PETITION_TYPES.autoGenerated,
    };

    it('should create a UploadPetitionStep2 without any errors', () => {
      const entity = new UploadPetitionStep2(VALID_ENTITY_GENERATED);
      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    describe('petitionFacts', () => {
      it('should return an error for "petitionFacts" when it is undefined', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionFacts: undefined,
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          petitionFacts: 'Add at least one fact',
        });
      });

      it('should return an error for "petitionFacts" when there is no string in the array', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionFacts: [],
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          petitionFacts: 'Add at least one fact',
        });
      });

      it('should return an error for "petitionFacts" when a fact is over the limit', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionFacts: [
            'a'.repeat(UploadPetitionStep2.PETITION_FACT_MAX_LENGTH + 1),
          ],
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          'petitionFacts[0]': 'Facts cannot exceed 9000 characters',
        });
      });

      it('should return an error for "petitionFacts" when a fact is under the minimum', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionFacts: ['', 'aaa'],
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          'petitionFacts[0]': 'Add at least one fact',
        });
      });
    });

    describe('petitionReasons', () => {
      it('should return an error for "petitionReasons" when it is undefined', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionReasons: undefined,
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          petitionReasons: 'Add at least one reason',
        });
      });

      it('should return an error for "petitionReasons" when there is no string in the array', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionReasons: [],
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          petitionReasons: 'Add at least one reason',
        });
      });

      it('should return an error for "petitionReasons" when a fact is over the limit', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionReasons: [
            'a'.repeat(UploadPetitionStep2.PETITION_REASON_MAX_LENGTH) + 1,
          ],
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          'petitionReasons[0]': 'Reasons cannot exceed 9000 characters',
        });
      });

      it('should return an error for "petitionReasons" when a fact is under the minimum', () => {
        const entity = new UploadPetitionStep2({
          ...VALID_ENTITY_GENERATED,
          petitionReasons: ['', 'aaa'],
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(errors).toEqual({
          'petitionReasons[0]': 'Add at least one reason',
        });
      });
    });
  });
});
