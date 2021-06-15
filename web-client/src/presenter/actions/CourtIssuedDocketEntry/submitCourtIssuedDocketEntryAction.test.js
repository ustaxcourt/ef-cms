import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCourtIssuedDocketEntryAction } from './submitCourtIssuedDocketEntryAction';

describe('submitCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET } =
    applicationContext.getConstants();

  it('should call the interactor for filing a court-issued docket entry', async () => {
    await runAction(submitCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        docketEntryId: 'abc',
        form: {
          attachments: false,
          date: '2019-01-01T00:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'Order',
          eventCode: 'O',
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a coversheet for court issued documents that require one', async () => {
    await runAction(submitCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        docketEntryId: 'abc',
        form: {
          attachments: false,
          date: '2019-01-01T00:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'Order',
          eventCode: COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET[0],
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should not generate a coversheet for court issued documents that do not require one', async () => {
    await runAction(submitCourtIssuedDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        docketEntryId: 'abc',
        form: {
          attachments: false,
          date: '2019-01-01T00:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'Order',
          eventCode: 'O',
          freeText: 'Testing',
          generatedDocumentTitle: 'Order F',
          scenario: 'Type A',
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });
});
