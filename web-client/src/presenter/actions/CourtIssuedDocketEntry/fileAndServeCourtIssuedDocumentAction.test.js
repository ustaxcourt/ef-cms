import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fileAndServeCourtIssuedDocumentAction } from './fileAndServeCourtIssuedDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('submitCourtIssuedDocketEntryAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call the interactor for filing and serving court-issued documents', async () => {
    const thisDocketNumber = '123-20';

    await runAction(fileAndServeCourtIssuedDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: thisDocketNumber,
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
      applicationContext.getUseCases()
        .fileAndServeCourtIssuedDocumentInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().fileAndServeCourtIssuedDocumentInteractor
        .mock.calls[0][1].docketNumbers,
    ).toEqual([thisDocketNumber]);
  });

  it('should return a pdfUrl when one is generated, the success message is set for unconsolidated cases, and overwritable is false', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext
      .getUseCases()
      .fileAndServeCourtIssuedDocumentInteractor.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    const result = await runAction(fileAndServeCourtIssuedDocumentAction, {
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

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Document served. ',
        overwritable: false,
      },
      pdfUrl: mockPdfUrl,
    });
  });

  describe('consolidated cases', () => {
    it('should pass the docket number for each checked case, the correct success message is returned, and overwritable is false', async () => {
      const leadDocketNumber = '123-20';
      const checkedDocketNumber1 = 'DogCow';
      const checkedDocketNumber2 = 'Moof';

      const result = await runAction(fileAndServeCourtIssuedDocumentAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketNumber: leadDocketNumber,
            leadDocketNumber,
          },
          form: {
            eventCode: 'O',
          },
          formattedCaseDetail: {
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
                docketNumber: 'Clarus',
              },
              {
                checked: true,
                docketNumber: checkedDocketNumber2,
              },
            ],
          },
        },
      });

      expect(
        applicationContext.getUseCases()
          .fileAndServeCourtIssuedDocumentInteractor.mock.calls[0][1]
          .docketNumbers,
      ).toEqual([leadDocketNumber, checkedDocketNumber1, checkedDocketNumber2]);

      expect(result.output.alertSuccess).toEqual({
        message: 'Document served to selected cases in group. ',
        overwritable: false,
      });
    });

    it("should pass only one docket number if this isn't lead case", async () => {
      const leadDocketNumber = '123-20';
      const thisDocketNumber = '126-22';

      await runAction(fileAndServeCourtIssuedDocumentAction, {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketNumber: thisDocketNumber,
            leadDocketNumber,
          },
          form: {
            eventCode: 'O',
          },
          formattedCaseDetail: {
            consolidatedCases: [
              {
                checked: true,
                docketNumber: leadDocketNumber,
              },
              { checked: true, docketNumber: thisDocketNumber },
              {
                checked: true,
                docketNumber: 'DogCow',
              },
              {
                checked: false,
                docketNumber: 'Clarus',
              },
              {
                checked: true,
                docketNumber: 'Moof',
              },
            ],
          },
        },
      });

      expect(
        applicationContext.getUseCases()
          .fileAndServeCourtIssuedDocumentInteractor.mock.calls[0][1]
          .docketNumbers,
      ).toEqual([thisDocketNumber]);
    });

    const {
      COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
      ENTERED_AND_SERVED_EVENT_CODES,
    } = applicationContext.getConstants();

    const eventCodesNotCompatibleWithConsolidation = [
      ...ENTERED_AND_SERVED_EVENT_CODES,
      ...COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ];

    eventCodesNotCompatibleWithConsolidation.forEach(notCompatibleEventCode => {
      it(`should pass only one docket number since the ${notCompatibleEventCode} event code isn't compatible with consolidation`, async () => {
        const leadDocketNumber = '123-20';

        await runAction(fileAndServeCourtIssuedDocumentAction, {
          modules: {
            presenter,
          },
          state: {
            caseDetail: {
              docketNumber: leadDocketNumber,
              leadDocketNumber,
            },
            form: {
              eventCode: notCompatibleEventCode,
            },
            formattedCaseDetail: {
              consolidatedCases: [
                {
                  checked: true,
                  docketNumber: leadDocketNumber,
                },
                {
                  checked: true,
                  docketNumber: 'DogCow',
                },
                {
                  checked: false,
                  docketNumber: 'Clarus',
                },
                {
                  checked: true,
                  docketNumber: 'Moof',
                },
              ],
            },
          },
        });

        expect(
          applicationContext.getUseCases()
            .fileAndServeCourtIssuedDocumentInteractor.mock.calls[0][1]
            .docketNumbers,
        ).toEqual([leadDocketNumber]);
      });
    });
  });
});
