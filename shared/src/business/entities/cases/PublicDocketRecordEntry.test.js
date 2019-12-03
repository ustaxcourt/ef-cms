const { PublicDocketRecordEntry } = require('./PublicDocketRecordEntry');

describe('PublicDocketRecordEntry', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocketRecordEntry({
      description: 'testing',
      documentId: 'testing',
      filedBy: 'testing',
      filingDate: 'testing',
      index: 'testing',
    });

    expect(entity.toRawObject()).toEqual({
      description: 'testing',
      documentId: 'testing',
      filedBy: 'testing',
      filingDate: 'testing',
      index: 'testing',
    });
  });
});
