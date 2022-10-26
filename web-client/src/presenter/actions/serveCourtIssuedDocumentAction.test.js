import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { serveCourtIssuedDocumentAction } from './serveCourtIssuedDocumentAction';

describe('serveCourtIssuedDocumentAction', () => {
  global.window = global;
  global.Blob = () => {};
  let mockPdfUrl = { pdfUrl: 'www.example.com' };
  const clientConnectionId = 'ABC123';
  const docketEntryId = 'bbd6f887-1e53-46e4-94e6-b636bf8c832a';

  const {
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ENTERED_AND_SERVED_EVENT_CODES,
  } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .serveCourtIssuedDocumentInteractor.mockImplementation(() => mockPdfUrl);
  });

  it('should call the interactor that serves court issued documents and pass the clientConnectionId to the interactor', async () => {
    await runAction(serveCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          consolidatedCases: [
            { docketNumber: '102-20' },
            { docketNumber: '101-20' },
          ],
          docketEntries: [
            {
              docketEntryId,
              eventCode: 'O',
            },
            {
              docketEntryId: 'a57d7c0c-94a0-4587-8637-36b5effdc424',
              eventCide: 'OST',
            },
          ],
          docketNumber: '101-20',
        },
        clientConnectionId,
        docketEntryId,
      },
    });

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls[0][1],
    ).toEqual({
      docketEntryId,
      docketNumbers: ['101-20'],
      subjectCaseDocketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
        .calls[0][2],
    ).toEqual(clientConnectionId);
  });

  describe('consolidated cases', () => {
    const eventCodesNotCompatibleWithConsolidation = [
      ...ENTERED_AND_SERVED_EVENT_CODES,
      ...COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ];

    it('should pass the docket number for each checked case', async () => {
      const leadDocketNumber = '123-20';
      const checkedDocketNumber1 = '124-20';
      const checkedDocketNumber2 = '125-20';

      await runAction(serveCourtIssuedDocumentAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              {
                checked: true,
                docketNumber: leadDocketNumber,
              },
              {
                checked: true,
                docketNumber: checkedDocketNumber1,
              },
              {
                checked: false,
                docketNumber: '700-20',
              },
              {
                checked: true,
                docketNumber: checkedDocketNumber2,
              },
            ],
            docketEntries: [
              {
                docketEntryId,
                eventCode: 'O',
              },
              {
                docketEntryId: 'a57d7c0c-94a0-4587-8637-36b5effdc424',
                eventCide: 'OST',
              },
            ],
            docketNumber: leadDocketNumber,
            leadDocketNumber,
          },
          clientConnectionId,
          docketEntryId,
        },
      });

      expect(
        applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
          .calls[0][1].docketNumbers,
      ).toEqual([leadDocketNumber, checkedDocketNumber1, checkedDocketNumber2]);
    });

    it("should pass only one docket number if this isn't lead case", async () => {
      const leadDocketNumber = '123-20';
      const thisDocketNumber = '126-22';

      await runAction(serveCourtIssuedDocumentAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            consolidatedCases: [
              {
                checked: true,
                docketNumber: leadDocketNumber,
              },
              {
                checked: true,
                docketNumber: '222-22',
              },
              {
                checked: false,
                docketNumber: '700-20',
              },
            ],
            docketEntries: [
              {
                docketEntryId,
                eventCode: 'O',
              },
              {
                docketEntryId: 'a57d7c0c-94a0-4587-8637-36b5effdc424',
                eventCide: 'OST',
              },
            ],
            docketNumber: thisDocketNumber,
          },
          clientConnectionId,
          docketEntryId,
        },
      });

      expect(
        applicationContext.getUseCases().serveCourtIssuedDocumentInteractor.mock
          .calls[0][1].docketNumbers,
      ).toEqual([thisDocketNumber]);
    });

    eventCodesNotCompatibleWithConsolidation.forEach(notCompatibleEventCode => {
      it(`should pass only one docket number since the ${notCompatibleEventCode} event code isn't compatible with consolidation`, async () => {
        const leadDocketNumber = '123-20';

        await runAction(serveCourtIssuedDocumentAction, {
          modules: {
            presenter,
          },
          state: {
            caseDetail: {
              consolidatedCases: [
                {
                  checked: true,
                  docketNumber: leadDocketNumber,
                },
                {
                  checked: true,
                  docketNumber: '321-20',
                },
                {
                  checked: false,
                  docketNumber: '432-21',
                },
                {
                  checked: true,
                  docketNumber: '987-22',
                },
              ],
              docketEntries: [
                {
                  docketEntryId,
                  eventCode: notCompatibleEventCode,
                },
              ],
              docketNumber: leadDocketNumber,
              leadDocketNumber,
            },
            clientConnectionId,
            docketEntryId,
          },
        });

        expect(
          applicationContext.getUseCases().serveCourtIssuedDocumentInteractor
            .mock.calls[0][1].docketNumbers,
        ).toEqual([leadDocketNumber]);
      });
    });
  });
});
