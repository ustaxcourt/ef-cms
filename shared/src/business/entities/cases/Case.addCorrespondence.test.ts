import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('addCorrespondence', () => {
  it('should successfully add correspondence', () => {
    const caseEntity = new Case(MOCK_CASE, { applicationContext });

    caseEntity.fileCorrespondence({
      correspondenceId: 'yeehaw',
      documentTitle: 'Correspondence document',
    });

    expect(caseEntity.correspondence.length).toEqual(1);
  });
});
