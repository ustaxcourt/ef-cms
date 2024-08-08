import {
  CASE_TYPES,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/business/entities/EntityConstants';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { cloneDeep } from 'lodash';
import joi from 'joi';

export class IrsNoticeForm extends JoiValidationEntity {
  public key: string;
  public file?: File;
  public size?: number;
  public caseType: string;
  public noticeIssuedDate?: string;
  public taxYear?: number;
  public cityAndStateIssuingOffice?: string;

  constructor(rawProps) {
    super('IrsNoticeForm');
    this.key = rawProps.key;
    this.file = rawProps.file;
    this.size = rawProps.size;
    this.caseType = rawProps.caseType;
    this.cityAndStateIssuingOffice = rawProps.cityAndStateIssuingOffice;
    this.noticeIssuedDate = rawProps.noticeIssuedDate;
    this.taxYear = rawProps.taxYear;
  }

  static VALID_CASE_TYPES = [
    ...cloneDeep(CASE_TYPES),
    'Disclosure1',
    'Disclosure2',
  ]
    .map(caseType => {
      const caseDescription = CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[caseType];
      if (caseDescription) {
        return caseType;
      }
    })
    .filter(Boolean);

  static taxYearLimit = 100;

  static VALIDATION_RULES = {
    caseType: JoiValidationConstants.STRING.required()
      .valid(...this.VALID_CASE_TYPES)
      .messages({
        '*': 'Select a case type',
      }),
    cityAndStateIssuingOffice: JoiValidationConstants.STRING.max(100)
      .optional()
      .messages({
        'string.max': 'Limit is 100 characters.',
      }),
    file: joi.optional(),
    key: joi.string().required(),
    noticeIssuedDate: JoiValidationConstants.ISO_DATE.max('now').messages({
      '*': 'Enter date in format MM/DD/YYYY.',
      'date.max': 'Date cannot be in the future.',
    }),
    size: joi
      .number()
      .integer()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .when('file', {
        is: joi.exist(),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        '*': 'Your ATP file size is empty',
        'number.max': `Your ATP file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      }),
    taxYear: JoiValidationConstants.STRING.max(IrsNoticeForm.taxYearLimit)
      .optional()
      .messages({
        '*': `Limit is ${IrsNoticeForm.taxYearLimit} characters.`,
      }),
  };

  getValidationRules() {
    return IrsNoticeForm.VALIDATION_RULES;
  }
}

export type RawIrsNoticeForm = ExcludeMethods<
  Omit<IrsNoticeForm, 'entityName'>
>;
