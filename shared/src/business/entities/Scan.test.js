const { Batch } = require('./Batch');
const { Scan } = require('./Scan');

describe('Scan entity', () => {
  let applicationContext;

  beforeEach(() => {
    applicationContext = {
      getUniqueId: () => 'unique-id-1',
    };
  });

  it('adds a Batch entity to the Scan entity', () => {
    const scan = new Scan({
      applicationContext,
      rawScan: {},
    });

    const batch = new Batch({
      applicationContext,
      rawBatch: {},
    });

    scan.addBatch(batch);

    expect(scan.batches).toHaveLength(1);
    expect(scan.batches[0].batchId).toEqual(batch.batchId);
  });

  it('removes a Batch entity', () => {
    const scan = new Scan({
      applicationContext,
      rawScan: {},
    });

    const batch = new Batch({
      applicationContext,
      rawBatch: {},
    });

    scan.addBatch(batch);
    scan.removeBatch(batch);

    expect(scan.batches).toHaveLength(0);
  });

  describe('Validation', () => {
    it('invalid number of batches', () => {
      const scan = new Scan({
        applicationContext,
        rawScan: {},
      });

      expect(scan.getFormattedValidationErrors()).toMatchObject({
        batches: 'At least one batch is required',
      });
    });
  });
});
