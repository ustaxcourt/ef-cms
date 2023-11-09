import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import { remove } from 'lodash';
import joi from 'joi';

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.rawScan the raw scan data
 * @constructor
 */
export class Scan extends JoiValidationEntity {
  public batches: any[];
  public createdAt: string;
  public scanId: string;

  constructor({ applicationContext, rawScan }) {
    super('Scan');
    this.batches = rawScan.batches || [];
    this.createdAt = rawScan.createdAt || createISODateString();
    this.scanId = rawScan.scanId || applicationContext.getUniqueId();
  }

  /**
   * adds a batch to the current scan
   *
   * @param {Batch} batch Batch entity
   * @returns {Scan} Scan entity
   */
  addBatch(batch) {
    this.batches.push(batch);
    return this;
  }

  /**
   * removes a batch from the current scan
   *
   * @param {Batch} batchEntity Batch entity to remove
   * @returns {Scan} Scan entity
   */
  removeBatch(batchEntity) {
    const { batchId } = batchEntity;

    remove(this.batches, batch => {
      return batchId === batch.batchId;
    });

    return this;
  }

  /**
   * aggregates all pages for all associated Batch entities
   * note: after each Batch's pages are aggregated, its pages are
   * cleared for memory purposes
   *
   * @returns {Array} array of PNGs
   */
  getPages() {
    // flattens the array of pages for each batch
    const aggregatedPngs = this.batches.reduce((acc, val, idx) => {
      const aggregatedBatch = [...acc, ...val.pages];

      // free up memory after we've gotten the pages
      this.batches[idx].clear();

      return aggregatedBatch;
    }, []);

    return aggregatedPngs;
  }

  static VALIDATION_RULES = joi.object().keys({
    batches: joi
      .array()
      .min(1)
      .required()
      .messages({ '*': 'At least one batch is required' }),
    createdAt: JoiValidationConstants.ISO_DATE.required(),
    scanId: JoiValidationConstants.UUID.required(),
  });

  getValidationRules() {
    return Scan.VALIDATION_RULES;
  }
}
