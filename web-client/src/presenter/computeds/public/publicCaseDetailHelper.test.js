import { applicationContextPublic } from '../../../applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from './publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

let state;
describe('publicCaseDetailHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        docketNumber: '123-45',
        docketRecord: [],
      },
    };
  });

  it('should return the formattedDocketEntries as an array', () => {
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(Array.isArray(result.formattedDocketEntries)).toBeTruthy();
  });

  it('should indicate when a case is sealed', () => {
    state.caseDetail.isSealed = true;
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedCaseDetail.isCaseSealed).toBeTruthy();
  });

  it('should format docket entries with documents and sort chronologically', () => {
    state.caseDetail.docketRecord = [
      {
        action: 'something',
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
      },
      {
        description: 'second record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        filingDate: '2018-10-21T20:49:28.192Z',
        index: 1,
      },
      {
        description: 'third record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 3,
      },
      {
        description: 'fourth record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 2,
        signatory: 'abc',
      },
      {
        description: 'fifth record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
        filingDate: '2018-12-25T20:49:28.192Z',
        index: 5,
      },
      {
        description: 'sixth record',
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
        filingDate: '2018-12-25T20:49:28.192Z',
        index: 6,
      },
    ];
    state.caseDetail.documents = [
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Statement of Taxpayer Identification',
        documentType: 'Statement of Taxpayer Identification',
        processingStatus: 'pending',
      },
      {
        additionalInfo: 'additionalInfo!',
        additionalInfo2: 'additional info 2!',
        attachments: true,
        createdAt: '2018-10-21T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Petrs. Dylan Fowler & Jaquelyn Estes',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        documentTitle: 'Order to do something',
        documentType: 'Order',
        eventCode: 'O',
        processingStatus: 'complete',
        servedAt: '2018-11-27T20:49:28.192Z',
        status: 'served',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        documentTitle: 'Order to do something else',
        documentType: 'Order',
        eventCode: 'O',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-12-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        processingStatus: 'complete',
      },
      {
        createdAt: '2018-12-25T20:49:28.192Z',
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
        documentType: 'Transcript',
        eventCode: 'TRAN',
        processingStatus: 'complete',
        servedAt: '2018-11-27T20:49:28.192Z',
      },
    ];
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedDocketEntries).toMatchObject([
      {
        createdAtFormatted: '10/21/18',
        description: 'second record additionalInfo!',
        descriptionDisplay: 'Answer',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        eventCode: 'A',
        filedBy: 'Petrs. Dylan Fowler & Jaquelyn Estes',
        filingsAndProceedingsWithAdditionalInfo:
          ' additionalInfo! (Attachment(s)) additional info 2!',
        hasDocument: true,
        index: 1,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: false,
        signatory: undefined,
      },
      {
        createdAtFormatted: undefined,
        description: 'fourth record',
        descriptionDisplay: 'Order to do something else',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        eventCode: 'O',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 2,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
        signatory: 'abc',
      },
      {
        createdAtFormatted: '10/25/18',
        description: 'third record',
        descriptionDisplay: 'Order to do something',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        eventCode: 'O',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 3,
        isPaper: undefined,
        servedAtFormatted: '11/27/18',
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
        showNotServed: false,
        showServed: true,
        signatory: undefined,
      },
      {
        action: 'something',
        createdAtFormatted: '11/21/18',
        description: 'first record',
        descriptionDisplay: 'Petition',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 4,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: false,
        signatory: undefined,
      },
      {
        action: undefined,
        createdAtFormatted: '12/25/18',
        description: 'fifth record',
        descriptionDisplay: 'fifth record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
        eventCode: 'RQT',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 5,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: false,
        signatory: undefined,
      },
      {
        action: undefined,
        createdAtFormatted: '12/25/18',
        description: 'sixth record',
        descriptionDisplay: 'sixth record',
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
        eventCode: 'TRAN',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 6,
        isPaper: undefined,
        servedAtFormatted: '11/27/18',
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: true,
        signatory: undefined,
      },
    ]);
  });
});
