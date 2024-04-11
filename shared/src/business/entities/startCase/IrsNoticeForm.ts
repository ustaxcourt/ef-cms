import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
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
    caseType: joi.string().required(),
    file: joi.required(),
    key: joi.string().required(),
    lastDateOfPeriod: joi.string().required(),
    size: joi.number().required(),
    taxYear: joi.number().required(),
  };

  getValidationRules() {
    return IrsNoticeForm.VALIDATION_RULES;
  }
}

export type RawIrsNoticeForm = ExcludeMethods<
  Omit<IrsNoticeForm, 'entityName'>
>;
