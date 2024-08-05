import {
  RawUploadPetitionStep3,
  UploadPetitionStep3,
} from '@shared/business/entities/startCase/UploadPetitionStep3';

describe('UploadPetitionStep3', () => {
  describe('has IRS notice', () => {
    const VALID_ENTITY: RawUploadPetitionStep3 = {
      hasIrsNotice: true,
      hasUploadedIrsNotice: true,
      irsNotices: [
        {
          caseType: 'Deficiency',
          file: {} as File,
          key: 'SOME KEY',
          size: 1,
          todayDate: "TODAYS' DATE",
        },
      ],
      irsNoticesRedactionAcknowledgement: true,
    };

    it('should create a valid instance of "UploadPetitionStep3" entity', () => {
      const entity = new UploadPetitionStep3(VALID_ENTITY);

      expect(entity).toBeDefined();

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    describe('VALIDATION', () => {
      describe('irsNoticesRedactionAcknowledgement', () => {
        it('should return an error message for "irsNoticesRedactionAcknowledgement" if its undefined', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            irsNoticesRedactionAcknowledgement: undefined,
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            irsNoticesRedactionAcknowledgement:
              '"irsNoticesRedactionAcknowledgement" is required',
          });
        });

        it('should return an error message for "irsNoticesRedactionAcknowledgement" if its false', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            irsNoticesRedactionAcknowledgement: false,
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            irsNoticesRedactionAcknowledgement:
              '"irsNoticesRedactionAcknowledgement" must be [true]',
          });
        });
      });

      describe('irsNotices', () => {
        it('should return an error message for "irsNotices" if there are no items in array', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            irsNotices: [],
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            irsNotices: '"irsNotices" must contain at least 1 items',
          });
        });

        it('should return an error message for "irsNotices" if its undefined', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            irsNotices: undefined,
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            irsNotices: '"irsNotices" must contain at least 1 items',
          });
        });
        it('should return an error message for "irsNotices" when there is more than the max in array', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            irsNotices: [
              VALID_ENTITY.irsNotices![0],
              VALID_ENTITY.irsNotices![0],
              VALID_ENTITY.irsNotices![0],
              VALID_ENTITY.irsNotices![0],
              VALID_ENTITY.irsNotices![0],
              VALID_ENTITY.irsNotices![0],
            ],
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            irsNotices:
              '"irsNotices" must contain less than or equal to 5 items',
          });
        });
      });
    });
  });

  describe('does not have IRS notice', () => {
    const VALID_ENTITY: RawUploadPetitionStep3 = {
      caseType: 'Innocent Spouse',
      hasIrsNotice: false,
      hasUploadedIrsNotice: false,
    };

    it('should create a valid instance of "UploadPetitionStep3" entity without IRS notice', () => {
      const entity = new UploadPetitionStep3(VALID_ENTITY);

      expect(entity).toBeDefined();

      const errors = entity.getFormattedValidationErrors();
      expect(errors).toEqual(null);
    });

    describe('VALIDATION', () => {
      describe('caseType', () => {
        it('should return an error message for "caseType" if its undefined', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            caseType: undefined,
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            caseType: 'Select a case type',
          });
        });

        it('should return an error message for "caseType" if its an invalid option', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            caseType: 'SOME RANDOM CASE TYPE',
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            caseType: 'Select a correct case type',
          });
        });
      });
    });
  });
});
