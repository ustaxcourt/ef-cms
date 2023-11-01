import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity_New } from '@shared/business/entities/joiValidationEntity/JoiValidationEntity_New';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import joi from 'joi';

export class Batch extends JoiValidationEntity_New {
  public batchId: string;
  public batchIndex: string;
  public createdAt: string;
  public pages: any[];

  constructor({ applicationContext, rawBatch }) {
    super('Batch');

    this.batchId = rawBatch.batchId || applicationContext.getUniqueId();
    this.batchIndex = rawBatch.batchIndex || 0;
    this.createdAt = rawBatch.createdAt || createISODateString();
    this.pages = rawBatch.pages || [];
  }

  static VALIDATION_RULES = joi.object().keys({
    batchId: JoiValidationConstants.UUID.required(),
    batchIndex: joi
      .number()
      .integer()
      .min(0)
      .required()
      .messages({ '*': 'Invalid batch index' }),
    createdAt: JoiValidationConstants.ISO_DATE.required(),
    pages: joi
      .array()
      .min(1)
      .required()
      .messages({ '*': 'At least one page is required' }),
  });

  addPage(page): Batch {
    this.pages.push(page);
    return this;
  }

  clear(): Batch {
    this.pages = [];
    return this;
  }

  getValidationRules() {
    return Batch.VALIDATION_RULES;
  }
}
