import { Batch } from './Batch';
import { applicationContext } from '../test/createTestApplicationContext';
import { extractCustomMessages } from './utilities/extractCustomMessages';

describe('Batch entity', () => {
  it('adds a page', () => {
    const batch = new Batch({
      applicationContext,
      rawBatch: {},
    });
    batch.addPage('page 1');

    expect(batch.pages).toHaveLength(1);
  });

  it('clears the pages', () => {
    const batch = new Batch({ applicationContext, rawBatch: {} });
    batch.addPage('page 1');
    batch.addPage('page 2');
    batch.clear();

    expect(batch.pages).toHaveLength(0);
  });

  describe('Validation', () => {
    it('validates minimum number of pages', () => {
      const batch = new Batch({ applicationContext, rawBatch: {} });

      const customMessages = extractCustomMessages(batch.getValidationRules());

      expect(batch.getFormattedValidationErrors()).toMatchObject({
        pages: customMessages.pages[0],
      });
    });

    it('invalid batchIndex', () => {
      const batch = new Batch({
        applicationContext,
        rawBatch: {
          batchIndex: -1,
          pages: ['page 1'],
        },
      });
      const customMessages = extractCustomMessages(batch.getValidationRules());
      expect(batch.getFormattedValidationErrors()).toMatchObject({
        batchIndex: customMessages.batchIndex[0],
      });
    });
  });
});
