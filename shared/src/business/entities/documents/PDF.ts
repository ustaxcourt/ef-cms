const joi = require('joi').extend(require('@hapi/joi-date'));
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class PDF extends JoiValidationEntity {
  public file: object;
  public size: number;

  constructor(rawProps) {
    super('PDF');

    this.file = rawProps.file;
    this.size = rawProps.size;
  }

  static VALIDATION_RULES = {
    file: joi.object().required().description('The PDF file'),
    size: JoiValidationConstants.MAX_FILE_SIZE_BYTES.required().description(
      'The size of the file in bytes.',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {};

  getValidationRules() {
    return PDF.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return PDF.VALIDATION_ERROR_MESSAGES;
  }
}
