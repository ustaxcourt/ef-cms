import {
  PROCEDURE_TYPES_MAP,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import {
  RawUploadPetitionStep4,
  UploadPetitionStep4,
} from '@shared/business/entities/startCase/UploadPetitionStep4';

describe('UploadPetitionStep4', () => {
  const VALID_ENTITY: RawUploadPetitionStep4 = {
    preferredTrialCity: TRIAL_CITY_STRINGS[0],
    procedureType: PROCEDURE_TYPES_MAP.regular,
  };

  it('should create a valid instance of "UploadPetitionStep4" entity', () => {
    const entity = new UploadPetitionStep4(VALID_ENTITY);

    expect(entity).toBeDefined();

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('preferredTrialCity', () => {
      it('should return a validation error message for "preferredTrialCity" when it does not match the regex patter', () => {
        const entity = new UploadPetitionStep4({
          ...VALID_ENTITY,
          preferredTrialCity: 'aaaaaa',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          preferredTrialCity: 'Select a preferred trial location',
        });
      });

      it('should return a validation error message for "preferredTrialCity" when it is undefined', () => {
        const entity = new UploadPetitionStep4({
          ...VALID_ENTITY,
          preferredTrialCity: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          preferredTrialCity: 'Select a preferred trial location',
        });
      });
    });

    describe('procedureType', () => {
      it('should return a validation error message for "procedureType" is an invalid option', () => {
        const entity = new UploadPetitionStep4({
          ...VALID_ENTITY,
          procedureType: 'SOME RANDOM PROCEDURE TYP',
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          procedureType: 'Select a case procedure',
        });
      });

      it('should return a validation error message for "procedureType" when it is undefined', () => {
        const entity = new UploadPetitionStep4({
          ...VALID_ENTITY,
          procedureType: undefined,
        });

        expect(entity).toBeDefined();

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({
          procedureType: 'Select a case procedure',
        });
      });
    });
  });
});
