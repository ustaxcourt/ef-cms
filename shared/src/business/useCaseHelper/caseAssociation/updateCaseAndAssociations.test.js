const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../../src/test/mockCase');
const { updateCaseAndAssociations } = require('./updateCaseAndAssociations');

describe('updateCaseAndAssociations', () => {
  let updateCaseMock = jest.fn();
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(updateCaseMock);
  });

  it('always sends valid entities to the updateCase persistence method', async () => {
    await updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: MOCK_CASE,
    });
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(updateCaseMock).toHaveBeenCalled();
    const updateArgs = updateCaseMock.mock.calls[0][0];

    expect(updateArgs.caseToUpdate.isValidated).toBe(true);
    expect(updateArgs.oldCase.isValidated).toBe(true);
  });
});
