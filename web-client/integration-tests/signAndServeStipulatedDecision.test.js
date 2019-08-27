import {
  createMessage,
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
  beforeEach(() => {
    jest.setTimeout(30000);

    const fakeData =
      'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
    const fakeFile = Buffer.from(fakeData, 'base64');
    fakeFile.name = 'fakeFile.pdf';

    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
      pdfjsObj: {
        getData: () => {
          return new Promise(resolve => {
            resolve(new Uint8Array(fakeFile));
          });
        },
      },
    };
  });

  let docketNumber = null;
  let signedDocumentId = null;
  let caseDetail;

  it('login as a taxpayer and create a case', async () => {
    await loginAs(test, 'taxpayer');
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

  it('docketclerk assigns the stipulated decision to the seniorattorney', async () => {
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

  it('senior attorney signs the proposed stipulated decision', async () => {
    await loginAs(test, 'seniorattorney');
    const inbox = await getFormattedMyInbox(test);
    const stipulatedDecision = inbox.find(
      item =>
        item.document.documentType === 'Proposed Stipulated Decision' &&
        item.docketNumber === caseDetail.docketNumber,
    );
    await signProposedStipulatedDecision(test, stipulatedDecision);
  });

  it('docketclerk serves the signed stipulated decision', async () => {
    await loginAs(test, 'docketclerk');
    const inbox = await getFormattedMyInbox(test);
    const signedStipulatedDecision = inbox.find(
      item =>
        item.document.documentType === 'Stipulated Decision' &&
        item.docketNumber === caseDetail.docketNumber,
    );
    signedDocumentId = signedStipulatedDecision.document.documentId;
    await serveDocument({
      docketNumber: signedStipulatedDecision.docketNumber,
      documentId: signedStipulatedDecision.document.documentId,
      messageId: signedStipulatedDecision.currentMessage.messageId,
      test,
      workItemIdToMarkAsRead: signedStipulatedDecision.workItemId,
    });
  });

  it('the case status should become closed', async () => {
    caseDetail = test.getState('caseDetail');
    ({ docketNumber } = caseDetail);

    await viewCaseDetail({
      docketNumber,
      test,
    });

    const signedDocument = caseDetail.documents.find(
      d => d.documentId === signedDocumentId,
    );
    expect(signedDocument.status).toEqual('served');
    expect(caseDetail.status).toEqual('Closed');
  });
});
