const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { Correspondence } = require('../Correspondence');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('deleteCorrespondenceById', () => {
  const mockCorrespondence = new Correspondence({
    documentTitle: 'A correpsondence',
    filingDate: '2025-03-01T00:00:00.000Z',
    userId: MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'].userId,
  });

  it('should delete the correspondence document with the given id', () => {
    const myCase = new Case(
      { ...MOCK_CASE, correspondence: [mockCorrespondence] },
      {
        applicationContext,
      },
    );
    expect(myCase.correspondence.length).toEqual(1);
    myCase.deleteCorrespondenceById({
      correspondenceId: mockCorrespondence.correspondenceId,
    });
    expect(myCase.correspondence.length).toEqual(0);
    expect(
      myCase.correspondence.find(
        d => d.correspondenceId === mockCorrespondence.correspondenceId,
      ),
    ).toBeUndefined();
  });

  it('should not delete a document if a document with the given id does not exist', () => {
    const myCase = new Case(
      { ...MOCK_CASE, correspondence: [mockCorrespondence] },
      {
        applicationContext,
      },
    );
    expect(myCase.correspondence.length).toEqual(1);
    myCase.deleteCorrespondenceById({
      correspondenceId: '1234',
    });
    expect(myCase.correspondence.length).toEqual(1);
  });
});
