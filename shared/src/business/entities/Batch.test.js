const { Batch } = require('./Batch');

const { VALIDATION_ERROR_MESSAGES } = Batch;

describe('Batch entity', () => {
  let applicationContext;

  beforeEach(() => {
    applicationContext = {
      getUniqueId: () => 'unique-id-1',
    };
  });

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

      expect(batch.getFormattedValidationErrors()).toMatchObject({
        pages: VALIDATION_ERROR_MESSAGES.pages,
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

      expect(batch.getFormattedValidationErrors()).toMatchObject({
        batchIndex: VALIDATION_ERROR_MESSAGES.batchIndex,
      });
    });
  });
});
