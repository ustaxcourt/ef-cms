import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCourtIssuedDocumentInitialDataAction } from './setCourtIssuedDocumentInitialDataAction';

describe('setCourtIssuedDocumentInitialDataAction', () => {
  const docketEntryIds = [
    'ddfd978d-6be6-4877-b004-2b5735a41fee',
    '11597d22-0874-4c5e-ac98-a843d1472baf',
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    MOCK_CASE.docketEntries.push({
      docketEntryId: docketEntryIds[0],
      eventCode: 'OF',
    });
    MOCK_CASE.docketEntries.push({
      docketEntryId: docketEntryIds[1],
      eventCode: 'O',
      freeText: 'something',
    });
  });

  it('should set correct values on state.form for the docketEntryId passed in via props', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: docketEntryIds[0],
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      documentTitle: 'Order for Filing Fee on [Date] [Anything]',
      documentType: 'Order for Filing Fee',
      eventCode: 'OF',
      isOrder: true,
      requiresSignature: true,
      scenario: 'Type D',
    });
  });

  it('should set state.form.freeText if the selected document has a freeText property', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: docketEntryIds[1],
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      documentTitle: '[Anything]',
      documentType: 'Order',
      eventCode: 'O',
      freeText: 'something',
      isOrder: true,
      requiresSignature: true,
      scenario: 'Type A',
    });
  });

  it('should not set state.form if the docketEntryId cannot be found in caseDetail', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: '123',
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({});
  });

  it("should not set state.form if the selected document's eventCode is not found in the court-issued document list", async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: '9de27a7d-7c6b-434b-803b-7655f82d5e07', //Petition document on MOCK_CASE
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({});
  });
});
