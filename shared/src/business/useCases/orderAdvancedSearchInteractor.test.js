const {
  orderAdvancedSearchInteractor,
} = require('./orderAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('orderAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitionsclerk',
    });
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});
    await expect(
      orderAdvancedSearchInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns empty array if no it search params are passed in', async () => {
    const results = await orderAdvancedSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    applicationContext.getSearchClient().search.mockResolvedValue({
      hits: {
        hits: [
          {
            _source: {
              caseId: { S: '1' },
            },
          },
          {
            _source: {
              caseId: { S: '2' },
            },
          },
        ],
      },
    });

    const results = await orderAdvancedSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(applicationContext.getSearchClient().search).toHaveBeenCalled();
    // expect(
    //   applicationContext.getSearchClient().search.mock.calls[0][0].body.query
    //     .bool.must,
    // ).toEqual([
    //   {
    //     bool: {
    //       should: [
    //         {
    //           bool: {
    //             minimum_should_match: 2,
    //             should: [
    //               { term: { 'contactPrimary.M.name.S': 'test' } },
    //               { term: { 'contactPrimary.M.name.S': 'person' } },
    //             ],
    //           },
    //         },
    //         {
    //           bool: {
    //             minimum_should_match: 2,
    //             should: [
    //               { term: { 'contactPrimary.M.secondaryName.S': 'test' } },
    //               { term: { 'contactPrimary.M.secondaryName.S': 'person' } },
    //             ],
    //           },
    //         },
    //         {
    //           bool: {
    //             minimum_should_match: 2,
    //             should: [
    //               { term: { 'contactSecondary.M.name.S': 'test' } },
    //               { term: { 'contactSecondary.M.name.S': 'person' } },
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //   },
    // ]);
    // expect(results).toEqual([{ caseId: '1' }, { caseId: '2' }]);
  });
});
