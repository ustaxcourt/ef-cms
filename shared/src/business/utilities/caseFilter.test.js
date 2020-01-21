const { caseSealedFormatter, caseSearchFilter } = require('./caseFilter');

describe('caseFilter', () => {
  it('should format sealed cases to preserve ONLY attributes appearing in a whitelist', () => {
    const result = caseSealedFormatter({
      baz: 'quux',
      caseId: '123',
      docketNumber: '102-20',
      foo: 'bar',
      sealedDate: '2020-01-02T03:04:05.007Z',
    });
    expect(result).toMatchObject({
      docketNumber: expect.anything(),
      sealedDate: expect.anything(),
    });
  });
  it('should remove sealed cases from a set of advanced search results', () => {
    const result = caseSearchFilter([
      {
        baz: 'quux',
        caseId: '456',
        docketNumber: '101-20',
        foo: 'baz',
        sealedDate: undefined,
      },
      {
        baz: 'quux',
        caseId: '123',
        docketNumber: '102-20',
        foo: 'bar',
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
    ]);
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      docketNumber: '101-20',
      sealedDate: undefined,
    });
  });
});
