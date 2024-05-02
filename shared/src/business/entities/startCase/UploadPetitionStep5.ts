import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export class UploadPetitionStep5 extends JoiValidationEntity {
  public stinFile: File;
  public stinFileSize: number;

  constructor(rawProps: any) {
    super('UploadPetitionStep5');
    this.stinFile = rawProps.stinFile;
    this.stinFileSize = rawProps.stinFileSize;
  }

  static VALIDATION_RULES = {
    stinFile: joi.object().required().messages({
      '*': 'Upload a Statement of Taxpayer Identification Number (STIN)',
    }),
    stinFileSize: joi
      .when('stinFile', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.number().required().integer().min(1).max(MAX_FILE_SIZE_BYTES),
      })
      .messages({
        '*': 'Your STIN file size is empty',
        'number.max': `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
  };

  getValidationRules() {
    return UploadPetitionStep5.VALIDATION_RULES;
  }
}

export type RawUploadPetitionStep5 = ExcludeMethods<
  Omit<UploadPetitionStep5, 'entityName'>
>;
