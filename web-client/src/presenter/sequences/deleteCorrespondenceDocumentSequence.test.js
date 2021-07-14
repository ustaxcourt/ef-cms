import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCorrespondenceDocumentSequence } from './deleteCorrespondenceDocumentSequence';
import { presenter } from '../presenter-mock';

describe('deleteCorrespondenceDocumentSequence', () => {
  let cerebralTest;

  const mockCorrespondence1 = {
    correspondenceId: '1234',
    documentTitle: 'a lovely correspondence',
  };
  const mockCorrespondence2 = {
    correspondenceId: '2345',
    documentTitle: 'a lovely second correspondence',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.sequences = {
      deleteCorrespondenceDocumentSequence,
    };

    cerebralTest = CerebralTest(presenter);
  });

  it('should set viewerCorrespondenceToDisplay to the remaining correspondence after deleting', async () => {
    applicationContext
      .getUtilities()
      .formatCase.mockReturnValue({ correspondence: [mockCorrespondence2] });
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });

    const modal = {
      correspondenceToDelete: {
        correspondenceId: mockCorrespondence1.correspondenceId,
      },
    };

    cerebralTest.setState('modal', modal);

    await cerebralTest.runSequence('deleteCorrespondenceDocumentSequence');

    expect(cerebralTest.getState()).toMatchObject({
      viewerCorrespondenceToDisplay: mockCorrespondence2,
    });
  });
});
