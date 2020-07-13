const { PublicDocketRecordEntry } = require('./PublicDocketRecordEntry');

describe('PublicDocketRecordEntry', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocketRecordEntry({
      description: 'testing',
      documentId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
      filedBy: 'testing',
      filingDate: '2020-05-27T09:23:43.007Z',
      index: 1,
    });

    expect(entity.validate().toRawObject()).toEqual({
      description: 'testing',
      documentId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
      filedBy: 'testing',
      filingDate: '2020-05-27T09:23:43.007Z',
      index: 1,
    });
  });
});
