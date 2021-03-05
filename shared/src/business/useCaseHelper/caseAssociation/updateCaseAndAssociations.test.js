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
      .updateCase.mockImplementation(updateCaseMock);
  });
  it('always sends valid entities to the updateCase persistence method', async () => {
    await updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: MOCK_CASE,
    });
  });
});
