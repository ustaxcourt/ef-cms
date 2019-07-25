const { Batch } = require('./Batch');

describe('Batch entity', () => {
  it('adds a page', () => {
    const batch = new Batch({});
    batch.addPage('page 1');

    expect(batch.pages).toHaveLength(1);
  });

  it('clears the pages', () => {
    const batch = new Batch({});
    batch.addPage('page 1');
    batch.addPage('page 2');
    batch.clear();

    expect(batch.pages).toHaveLength(0);
  });

  describe('Validation', () => {
    it('validates minimum number of pages', () => {
      const batch = new Batch({});

      expect(batch.getFormattedValidationErrors()).toMatchObject({
        pages: 'At least one page is required',
      });
    });

    it('invalid batchIndex', () => {
      const batch = new Batch({
        batchIndex: -1,
        pages: ['page 1'],
      });

      expect(batch.getFormattedValidationErrors()).toMatchObject({
        batchIndex: 'Invalid batch index',
      });
    });
  });
});
