import { Case } from './Case';
import { Correspondence } from '../Correspondence';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('updateCorrespondence', () => {
  it('should update a correspondence document', () => {
    const mockCorrespondence = new Correspondence({
      correspondenceId: '123-abc',
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
    });
    const myCase = new Case(
      { ...MOCK_CASE, correspondence: [mockCorrespondence] },
      {
        applicationContext,
      },
    );

    myCase.updateCorrespondence({
      correspondenceId: mockCorrespondence.correspondenceId,
      documentTitle: 'updated title',
    });

    expect(
      myCase.correspondence.find(
        d => d.correspondenceId === mockCorrespondence.correspondenceId,
      ).documentTitle,
    ).toEqual('updated title');
  });

  it('should not throw an exception when the specified correspondence document is not found', () => {
    const mockCorrespondence = new Correspondence({
      correspondenceId: '123-abc',
      documentTitle: 'My Correspondence',
      filedBy: 'Docket clerk',
    });
    const myCase = new Case(
      { ...MOCK_CASE, correspondence: [mockCorrespondence] },
      {
        applicationContext,
      },
    );

    myCase.updateCorrespondence({
      correspondenceId: 'BAD-ID',
      documentTitle: 'updated title',
    });

    expect(
      myCase.correspondence.find(
        d => d.correspondenceId === mockCorrespondence.correspondenceId,
      ).documentTitle,
    ).toEqual('My Correspondence');
  });
});
