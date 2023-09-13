import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitCourtIssuedDocketEntryToConsolidatedGroupAction } from './submitCourtIssuedDocketEntryToConsolidatedGroupAction';

describe('submitCourtIssuedDocketEntryToConsolidatedGroupAction', () => {
  const mockDocketEntryId = 'eb37f518-855a-4ad4-83f5-21f2097ac924';
  const mockDocketNumber = '564-22';

  presenter.providers.applicationContext = applicationContext;

  const {
    COURT_ISSUED_EVENT_CODES,
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  } = applicationContext.getConstants();

  const COURT_ISSUED_EVENT_CODES_NO_COVERSHEET =
    COURT_ISSUED_EVENT_CODES.filter(d => !d.requiresCoversheet).map(
      d => d.eventCode,
    );

  it('should make a call to file the court issued docket entry', async () => {
    await runAction(submitCourtIssuedDocketEntryToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor,
    ).toHaveBeenCalled();
  });

  it('should make a call to file the court issued docket entry on the docketNumber from state', async () => {
    await runAction(submitCourtIssuedDocketEntryToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor.mock
        .calls[0][1].subjectDocketNumber,
    ).toEqual(mockDocketNumber);
  });

  it('should make a call to multi-docket the court issued docket entry for all docket numbers provided in props', async () => {
    const mockCheckedConsolidatedCasesToFileDocketEntryTo = [
      '103-20',
      '101-20',
      '123-20',
    ];

    await runAction(submitCourtIssuedDocketEntryToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumbers: mockCheckedConsolidatedCasesToFileDocketEntryTo,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor.mock
        .calls[0][1].docketNumbers,
    ).toEqual(mockCheckedConsolidatedCasesToFileDocketEntryTo);
  });

  it('should make a call to file the court issued docket entry using the information on state.form and using docketEntryId from state', async () => {
    const mockForm = {
      documentTitle: 'Order in the Court',
      eventCode: 'O',
    };

    await runAction(submitCourtIssuedDocketEntryToConsolidatedGroupAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketEntryId: mockDocketEntryId,
        form: mockForm,
      },
    });

    expect(
      applicationContext.getUseCases().fileCourtIssuedDocketEntryInteractor.mock
        .calls[0][1].documentMeta,
    ).toEqual({
      ...mockForm,
      docketEntryId: mockDocketEntryId,
    });
  });

  it('should return generateCoversheet true when the eventCode being filed requires a coversheet', async () => {
    const { output } = await runAction(
      submitCourtIssuedDocketEntryToConsolidatedGroupAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          caseDetail: {
            docketNumber: mockDocketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET[0],
          },
        },
      },
    );

    expect(output.generateCoversheet).toBe(true);
  });

  it('should return generateCoversheet false when the eventCode being filed does NOT require a coversheet', async () => {
    const { output } = await runAction(
      submitCourtIssuedDocketEntryToConsolidatedGroupAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          caseDetail: {
            docketNumber: mockDocketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: COURT_ISSUED_EVENT_CODES_NO_COVERSHEET[0],
          },
        },
      },
    );

    expect(output.generateCoversheet).toBe(false);
  });

  it('should return the docketEntryId to props', async () => {
    const { output } = await runAction(
      submitCourtIssuedDocketEntryToConsolidatedGroupAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          caseDetail: {
            docketNumber: mockDocketNumber,
          },
          docketEntryId: mockDocketEntryId,
          form: {
            eventCode: COURT_ISSUED_EVENT_CODES_NO_COVERSHEET[0],
          },
        },
      },
    );

    expect(output.docketEntryId).toBe(mockDocketEntryId);
  });
});
