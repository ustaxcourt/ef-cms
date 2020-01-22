const { caseSealedFormatter, caseSearchFilter } = require('./caseFilter');

describe('caseFilter', () => {
  it('should format sealed cases to preserve ONLY attributes appearing in a whitelist', () => {
    const result = caseSealedFormatter({
      baz: 'quux',
      caseId: '123',
      docketNumber: '102-20',
      docketNumberSuffix: 'S',
      foo: 'bar',
      sealedDate: '2020-01-02T03:04:05.007Z',
    });
    expect(result).toEqual({
      caseId: '123',
      docketNumber: '102-20',
      docketNumberSuffix: 'S',
      sealedDate: '2020-01-02T03:04:05.007Z',
    });
  });
  describe('caseSearchFilter', () => {
    const caseSearchResults = [
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
        practitioners: [{ userId: 'authPractitioner' }],
        respondents: [{ userId: 'authRespondent' }],
        sealedDate: '2020-01-02T03:04:05.007Z',
      },
    ];
    it('should remove sealed cases from a set of advanced search results', () => {
      const result = caseSearchFilter(caseSearchResults, {
        role: 'respondent',
        userId: 'some other respondent',
      });
      expect(result.length).toEqual(1);
      expect(result[0]).toMatchObject({
        docketNumber: '101-20',
        sealedDate: undefined,
      });
    });
    it('should keep sealed cases in search results if user is an internal user with permission to see sealed cases', () => {
      let result = caseSearchFilter(caseSearchResults, {
        role: 'petitionsclerk',
        userId: 'petitionsClerk',
      });
      expect(result.length).toEqual(2);
    });
    it('should keep sealed cases in search results if user is associated as practitioner or respondent', () => {
      let result = caseSearchFilter(caseSearchResults, {
        userId: 'authPractitioner',
      });
      expect(result.length).toEqual(2);
      result = caseSearchFilter(caseSearchResults, {
        userId: 'authRespondent',
      });
      expect(result.length).toEqual(2);
    });
  });
});
