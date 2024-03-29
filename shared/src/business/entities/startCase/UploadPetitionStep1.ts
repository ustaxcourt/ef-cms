import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../EntityConstants';
import joi from 'joi';

export class UploadPetitionStep1 extends JoiValidationEntity {
  public petitionFileSource: 'upload' | 'generated';
  public petitionFile: File;
  public petitionFileSize: number;
  public acknowledgeChecked: boolean;

  //TODO: Handle generated petition inputs

  constructor(rawProps) {
    super('UploadPetitionStep1');
    this.petitionFileSource = rawProps.petitionFileSource;
    this.petitionFile = rawProps.petitionFile;
    this.petitionFileSize = rawProps.petitionFileSize;
    this.acknowledgeChecked = rawProps.acknowledgeChecked;
  }

  static VALIDATION_RULES = {
    acknowledgeChecked: joi.boolean().when('petitionFileSource', {
      is: JoiValidationConstants.STRING.valid('upload'),
      otherwise: joi.optional(),
      then: joi.boolean().required().truthy(),
    }),
    petitionFile: joi.object().when('petitionFileSource', {
      is: JoiValidationConstants.STRING.valid('upload'),
      otherwise: joi.optional(),
      then: joi
        .object()
        .required()
        .messages({ '*': 'Upload the Petition PDF.' }),
    }),
    petitionFileSize: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('petitionFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        '*': 'Your Petition file size is empty',
        'number.max': `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
    petitionFileSource: joi.string().required().valid('upload', 'generated'),
  };

  getValidationRules() {
    return UploadPetitionStep1.VALIDATION_RULES;
  }
}

export type RawUploadPetitionStep1 = ExcludeMethods<UploadPetitionStep1>;
