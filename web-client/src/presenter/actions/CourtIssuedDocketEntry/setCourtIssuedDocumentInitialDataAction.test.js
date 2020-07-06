import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCourtIssuedDocumentInitialDataAction } from './setCourtIssuedDocumentInitialDataAction';

presenter.providers.applicationContext = applicationContext;

const documentIds = [
  'ddfd978d-6be6-4877-b004-2b5735a41fee',
  '11597d22-0874-4c5e-ac98-a843d1472baf',
];

MOCK_CASE.documents.push({
  documentId: documentIds[0],
  eventCode: 'OF',
});
MOCK_CASE.documents.push({
  documentId: documentIds[1],
  eventCode: 'O',
  freeText: 'something',
});

describe('setCourtIssuedDocumentInitialDataAction', () => {
  it('should set correct values on state.form for the documentId passed in via props', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: documentIds[0],
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
      scenario: 'Type D',
    });
  });

  it('should set state.form.freeText if the selected document has a freeText property', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: documentIds[1],
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      documentTitle: 'Order [Anything]',
      documentType: 'Order',
      eventCode: 'O',
      freeText: 'something',
      scenario: 'Type A',
    });
  });

  it('should not set state.form if the documentId cannot be found in caseDetail', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialDataAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: '123',
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
        documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859', //Petition document on MOCK_CASE
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({});
  });
});
