import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setSuccessfulStampFromDocumentTitleAction } from './setSuccessfulStampFromDocumentTitleAction';

describe('setSuccessfulStampFromDocumentTitleAction,', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets the success message from the documentTitle when the document eventCode is not PSDE', async () => {
    const mockMotionTitle = 'Motion for Continuance';

    const result = await runAction(setSuccessfulStampFromDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: mockMotionTitle,
              eventCode: 'O',
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual(
      `${mockMotionTitle} stamped successfully.`,
    );
  });
});
