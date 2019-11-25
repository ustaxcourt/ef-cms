import { Case } from '../../shared/src/business/entities/cases/Case';

import {
  createCourtIssuedDocketEntry,
  createMessage,
  fakeFile,
  getFormattedDocumentQCSectionInbox,
  getFormattedMyInbox,
  loginAs,
  serveDocument,
  setupTest,
  signProposedStipulatedDecision,
  uploadPetition,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
  viewDocumentDetailMessage,
} from './helpers';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => {
      return new Promise(resolve => {
        resolve(null);
      });
    },
  },
});

describe('a user signs and serves a stipulated decision', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => {
        return new Promise(resolve => {
          resolve(new Uint8Array(fakeFile));
        });
      },
    };
  });

  let docketNumber = null;
  let signedDocumentId = null;
  let caseDetail;

  it('login as a petitioner and create a case', async () => {
    await loginAs(test, 'petitioner');
    caseDetail = await uploadPetition(test);
    ({ docketNumber } = caseDetail.docketNumber);
  });

  it('respondent uploads a proposed stipulated decision', async () => {
    await loginAs(test, 'respondent');
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    await uploadProposedStipulatedDecision(test);
  });

  it('docketclerk assigns the stipulated decision to the adc', async () => {
    await loginAs(test, 'docketclerk');
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );
    const proposedStipulatedDecision = documentQCSectionInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    await viewDocumentDetailMessage({
      docketNumber: proposedStipulatedDecision.docketNumber,
      documentId: proposedStipulatedDecision.document.documentId,
      messageId: proposedStipulatedDecision.currentMessage.messageId,
      test,
      workItemIdToMarkAsRead: proposedStipulatedDecision.workItemId,
    });
    await createMessage({
      assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'Jeff, this is ready for review and signature',
      test,
    });
  });

  it('adc signs the proposed stipulated decision', async () => {
    await loginAs(test, 'adc');
    const inbox = await getFormattedMyInbox(test);
    const stipulatedDecision = inbox.find(
      item =>
        item.document.documentType === 'Proposed Stipulated Decision' &&
        item.docketNumber === caseDetail.docketNumber,
    );
    await signProposedStipulatedDecision(test, stipulatedDecision);
  });

  it('docketclerk creates a docket entry for the signed stipulated decision', async () => {
    await loginAs(test, 'docketclerk');
    const inbox = await getFormattedMyInbox(test);
    const signedStipulatedDecision = inbox.find(
      item =>
        item.document.documentType === 'Stipulated Decision' &&
        item.docketNumber === caseDetail.docketNumber,
    );
    signedDocumentId = signedStipulatedDecision.document.documentId;
    await createCourtIssuedDocketEntry({
      docketNumber: test.docketNumber,
      documentId: signedDocumentId,
      test,
    });
  });

  it('docketclerk serves the signed stipulated decision', async () => {
    await loginAs(test, 'docketclerk');
    caseDetail = test.getState('caseDetail');
    const signedDocument = caseDetail.documents.find(
      d => d.documentId === signedDocumentId,
    );
    signedDocumentId = signedDocument.documentId;
    await serveDocument({
      docketNumber: test.docketNumber,
      documentId: signedDocumentId,
      test,
    });
  });

  it('the case status should become closed', async () => {
    await viewCaseDetail({
      docketNumber: test.docketNumber,
      test,
    });
    caseDetail = test.getState('caseDetail');

    const signedDocument = caseDetail.documents.find(
      d => d.documentId === signedDocumentId,
    );
    expect(signedDocument.status).toEqual('served');
    expect(caseDetail.status).toEqual(Case.STATUS_TYPES.closed);
  });
});
