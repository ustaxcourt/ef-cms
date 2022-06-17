import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { submitCourtIssuedDocketEntryActionHelper } from './submitCourtIssuedDocketEntryActionHelper';

describe('submitCourtIssuedDocketEntryActionHelper', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should attempt to submit the expected docket entry', async () => {
    await submitCourtIssuedDocketEntryActionHelper({
      applicationContext,
      docketEntryId: '123',
      form: {
        eventCode: 'TE',
      },
      getDocketNumbers: () => ['101-20'],
      subjectDocketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor.mock
        .calls[0][1],
    ).toEqual({
      documentMeta: {
        docketEntryId: '123',
        docketNumbers: ['101-20'],
        eventCode: 'TE',
        subjectDocketNumber: '101-20',
      },
    });
  });

  it('should create a coversheet if the eventCode is a coversheet required document', async () => {
    await submitCourtIssuedDocketEntryActionHelper({
      applicationContext,
      form: {
        eventCode: 'TE',
      },
      getDocketNumbers: () => ['101-20'],
      subjectDocketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should NOT create a coversheet if the eventCode is a coversheet required document', async () => {
    await submitCourtIssuedDocketEntryActionHelper({
      applicationContext,
      form: {
        eventCode: 'O',
      },
      getDocketNumbers: () => ['101-20'],
      subjectDocketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
  });
});
