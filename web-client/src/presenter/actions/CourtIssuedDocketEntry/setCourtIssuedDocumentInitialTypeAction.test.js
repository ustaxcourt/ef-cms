import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setCourtIssuedDocumentInitialTypeAction } from './setCourtIssuedDocumentInitialTypeAction';

presenter.providers.applicationContext = applicationContext;

const documentId = 'ddfd978d-6be6-4877-b004-2b5735a41fee';

MOCK_CASE.documents.push({
  documentId,
  eventCode: 'OF',
});

describe('setCourtIssuedDocumentInitialTypeAction', () => {
  it('should set correct values on state.form for the documentId passed in via props', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialTypeAction, {
      modules: {
        presenter,
      },
      props: {
        documentId,
      },
      state: {
        caseDetail: MOCK_CASE,
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      attachments: false,
      documentTitle: 'Order for Filing Fee on [Date] [Anything]',
      documentType: 'OF - Order for Filing Fee',
      eventCode: 'OF',
      scenario: 'Type D',
    });
  });

  it('should not set state.form if the documentId cannot be found in caseDetail', async () => {
    const result = await runAction(setCourtIssuedDocumentInitialTypeAction, {
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
    const result = await runAction(setCourtIssuedDocumentInitialTypeAction, {
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
