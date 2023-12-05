import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSuccessfulStampFromDocumentTitleAction } from './setSuccessfulStampFromDocumentTitleAction';

describe('setSuccessfulStampFromDocumentTitleAction,', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets the success message from the documentTitle for the motion', async () => {
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

  it('sets the success message from the documentType for the motion', async () => {
    const mockDocumentType = 'Motion for Continuance';

    const result = await runAction(setSuccessfulStampFromDocumentTitleAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: mockDocumentType,
              eventCode: 'O',
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });

    expect(result.output.alertSuccess.message).toEqual(
      `${mockDocumentType} stamped successfully.`,
    );
  });
});
