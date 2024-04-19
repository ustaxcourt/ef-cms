import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import {
  LEGACY_TRIAL_CITY_STRINGS,
  PROCEDURE_TYPES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export class UploadPetitionStep4 extends JoiValidationEntity {
  public preferredTrialCity: string;
  public procedureType: string;

  constructor(rawProps: any) {
    super('UploadPetitionStep4');
    this.preferredTrialCity = rawProps.preferredTrialCity;
    this.procedureType = rawProps.procedureType;
  }

  static VALIDATION_RULES = {
    preferredTrialCity: joi.when('procedureType', {
      is: joi.exist(),
      otherwise: joi.optional(),
      then: joi
        .alternatives()
        .try(
          JoiValidationConstants.STRING.valid(
            ...TRIAL_CITY_STRINGS,
            ...LEGACY_TRIAL_CITY_STRINGS,
            null,
          ),
          JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER),
        )
        .required()
        .messages({ '*': 'Select a trial location' }),
    }),
    procedureType: JoiValidationConstants.STRING.required()
      .valid(...PROCEDURE_TYPES)
      .messages({
        '*': 'Select a case procedure',
      }),
  };

  getValidationRules() {
    return UploadPetitionStep4.VALIDATION_RULES;
  }
}

export type RawUploadPetitionStep4 = ExcludeMethods<
  Omit<UploadPetitionStep4, 'entityName'>
>;
