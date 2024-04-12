import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export class IrsNoticeForm extends JoiValidationEntity {
  public key: string;
  public file: File;
  public size: number;
  public caseType: string;
  public lastDateOfPeriod: string;
  public taxYear: number;

  constructor(rawProps) {
    super('IrsNoticeForm');
    this.key = rawProps.key;
    this.file = rawProps.file;
    this.size = rawProps.size;
    this.caseType = rawProps.caseType;
    this.lastDateOfPeriod = rawProps.lastDateOfPeriod;
    this.taxYear = rawProps.taxYear;
  }

  static VALIDATION_RULES = {
    caseType: joi.string().required(), //specific strings
    file: joi.required().messages({
      //optional
      '*': 'Upload a Petition',
    }),
    key: joi.string().required(),
    lastDateOfPeriod: joi.string().required(), //if provided make sure correct format
    size: joi //when file provided make sure under max size if not its optional
      .number()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .required()
      .messages({
        '*': 'Your Petition file size is empty',
        'number.max': `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
    taxYear: joi.number().required(), //not a number, can be string optional
  };

  getValidationRules() {
    return IrsNoticeForm.VALIDATION_RULES;
  }
}

export type RawIrsNoticeForm = ExcludeMethods<
  Omit<IrsNoticeForm, 'entityName'>
>;
