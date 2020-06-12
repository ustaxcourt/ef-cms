const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getConsolidatedCasesForLeadCase,
} = require('./getConsolidatedCasesForLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getConsolidatedCasesForLeadCase', () => {
  it('should retrieve all cases associated with the leadCaseId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId.mockReturnValue([MOCK_CASE]);

    await getConsolidatedCasesForLeadCase({
      applicationContext,
      casesAssociatedWithUserOrLeadCaseMap: {
        '123': MOCK_CASE,
      },
      leadCaseId: '123',
      userAssociatedCaseIdsMap: {},
    });

    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadCaseId.mock
        .calls[0][0],
    ).toMatchObject({ leadCaseId: '123' });
  });

  // TODO - Refactor Case constants into their own file.
  //  Test currently fails when trying to mock out Case.validateRawCollection
  //  due to circular dependency issue, UserCase pulls in Case validation text
  // it('should validate the retrieved cases', async () => {
  //   const mockCaseId = '123';
  //   applicationContext
  //     .getPersistenceGateway()
  //     .getCasesByLeadCaseId.mockResolvedValue([MOCK_CASE]);

  //   getConsolidatedCasesForLeadCase({
  //     applicationContext,
  //     casesAssociatedWithUserOrLeadCaseMap: {
  //       '123': MOCK_CASE,
  //     },
  //     leadCaseId: mockCaseId,
  //     userAssociatedCaseIdsMap: {},
  //   });

  //   expect(Case.validateRawCollection).toBeCalled();
  // });
});
