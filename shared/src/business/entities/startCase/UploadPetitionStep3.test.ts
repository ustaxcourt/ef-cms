import {
  RawUploadPetitionStep3,
  UploadPetitionStep3,
} from '@shared/business/entities/startCase/UploadPetitionStep3';

describe('UploadPetitionStep3', () => {
  describe('has IRS notice', () => {
    const VALID_ENTITY: RawUploadPetitionStep3 = {
      hasIrsNotice: true,
      irsNotices: [
        {
          caseType: 'Deficiency',
          key: 'SOME KEY',
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

        it('should return an error message for "irsNotices" if an item has an error in it', () => {
          const entity = new UploadPetitionStep3({
            ...VALID_ENTITY,
            irsNotices: [VALID_ENTITY.irsNotices![0], {}],
          });

          expect(entity).toBeDefined();

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toEqual({
            irsNotices: [
              {
                caseType: 'Select a case type',
                index: 1,
                key: '"key" is required',
              },
            ],
          });
        });
      });
    });
  });

  describe('does not have IRS notice', () => {
    const VALID_ENTITY: RawUploadPetitionStep3 = {
      caseType: 'Innocent Spouse',
      hasIrsNotice: false,
    };

    it('should create a valid instance of "UploadPetitionStep3" entity', () => {
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
