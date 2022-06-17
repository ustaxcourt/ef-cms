import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedDocketEntryToConsolidatedGroupAction } from './submitCourtIssuedDocketEntryToConsolidatedGroupAction';

describe('submitCourtIssuedDocketEntryToConsolidatedGroupAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should pass all of the checked docket numbers into the call to the submit interactor in the helper', async () => {
    await runAction(submitCourtIssuedDocketEntryToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          consolidatedCases: [
            {
              checked: true,
              docketNumber: '103-20',
            },
            {
              checked: false,
              docketNumber: '101-20',
            },
            {
              checked: true,
              docketNumber: '123-20',
            },
          ],
          docketNumber: '123-45',
        },
        docketEntryId: 'abc',
        form: {
          eventCode: 'O',
        },
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor.mock
        .calls[0][1],
    ).toEqual({
      documentMeta: {
        docketEntryId: 'abc',
        docketNumbers: ['103-20', '123-20'],
        eventCode: 'O',
        subjectDocketNumber: '123-45',
      },
    });
  });
});
