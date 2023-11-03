import { Batch } from './Batch';
import { Scan } from './Scan';
import { applicationContext } from '../test/createTestApplicationContext';

describe('Scan entity', () => {
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

  it('returns an array of aggregated pages from all batches', () => {
    const scan = new Scan({
      applicationContext,
      rawScan: {},
    });

    const firstBatch = new Batch({
      applicationContext,
      rawBatch: {},
    });

    firstBatch.addPage('page 1.1');
    firstBatch.addPage('page 1.2');
    firstBatch.addPage('page 1.3');
    firstBatch.addPage('page 1.4');

    const secondBatch = new Batch({
      applicationContext,
      rawBatch: {},
    });

    secondBatch.addPage('page 2.1');
    secondBatch.addPage('page 2.2');
    secondBatch.addPage('page 2.3');
    secondBatch.addPage('page 2.4');

    scan.addBatch(firstBatch);
    scan.addBatch(secondBatch);

    expect(scan.getPages()).toEqual([
      'page 1.1',
      'page 1.2',
      'page 1.3',
      'page 1.4',
      'page 2.1',
      'page 2.2',
      'page 2.3',
      'page 2.4',
    ]);
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
