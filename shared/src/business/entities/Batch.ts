import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class Batch extends JoiValidationEntity {
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

  /**
   * adds a page to current Batch
   *
   * @param {object} page the page to add
   * @returns {Batch} the batch entity after the page is added
   */
  addPage(page) {
    this.pages.push(page);
    return this;
  }

  /**
   * clears all pages within this Batch
   *
   * @returns {Batch} the batch entity after the pages are cleared
   */
  clear() {
    this.pages = [];
    return this;
  }

  getValidationRules() {
    return joi.object().keys({
      batchId: JoiValidationConstants.UUID.required(),
      batchIndex: joi
        .number()
        .integer()
        .min(0)
        .required()
        .messages(setDefaultErrorMessage('Invalid batch index')),
      createdAt: JoiValidationConstants.ISO_DATE.required(),
      pages: joi
        .array()
        .min(1)
        .required()
        .messages(setDefaultErrorMessage('At least one page is required')),
    });
  }
}
