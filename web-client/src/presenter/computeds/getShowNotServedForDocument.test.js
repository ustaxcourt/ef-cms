import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';

describe('getShowNotServedForDocument', () => {
  const documentId = applicationContext.getUniqueId();

  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  it('should return true if the document type is servable and does not have a servedAt', () => {
    const showNotServed = getShowNotServedForDocument({
      UNSERVABLE_EVENT_CODES,
      caseDetail: {
        docketRecord: [{ documentId }],
        documents: [
          {
            documentId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
          },
        ],
      },
      documentId,
      draftDocuments: [],
    });

    expect(showNotServed).toEqual(true);
  });

  it('should return false if the document type is unservable', () => {
    const showNotServed = getShowNotServedForDocument({
      UNSERVABLE_EVENT_CODES,
      caseDetail: {
        docketRecord: [{ documentId }],
        documents: [
          {
            documentId,
            documentTitle: 'Some Stuff',
            documentType: 'Corrected Transcript',
            eventCode: 'CTRA',
          },
        ],
      },
      documentId,
      draftDocuments: [],
    });

    expect(showNotServed).toEqual(false);
  });

  it('should return false if the document type is servable and has servedAt', () => {
    const showNotServed = getShowNotServedForDocument({
      UNSERVABLE_EVENT_CODES,
      caseDetail: {
        docketRecord: [{ documentId }],
        documents: [
          {
            documentId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
            servedAt: '2019-03-01T21:40:46.415Z',
          },
        ],
      },
      documentId,
      draftDocuments: [],
    });

    expect(showNotServed).toEqual(false);
  });

  it('should return false if the document type is servable and not served and the document is a draft', () => {
    const showNotServed = getShowNotServedForDocument({
      UNSERVABLE_EVENT_CODES,
      caseDetail: {
        docketRecord: [],
        documents: [
          {
            documentId,
            documentTitle: 'Some Stuff',
            documentType: 'Order',
            eventCode: 'O',
          },
        ],
      },
      documentId,
      draftDocuments: [{ documentId }],
    });

    expect(showNotServed).toEqual(false);
  });

  it('should return false if the document is not on the case detail', () => {
    const showNotServed = getShowNotServedForDocument({
      UNSERVABLE_EVENT_CODES,
      caseDetail: {
        docketRecord: [],
        documents: [],
      },
      documentId,
      draftDocuments: [{ documentId }],
    });

    expect(showNotServed).toEqual(false);
  });

  it('should return false when the document is a correspondence document', () => {
    // Correspondence documents should not be in case.documents and also are not served
    const correrspondenceDocumentId = applicationContext.getUniqueId();

    const showNotServed = getShowNotServedForDocument({
      UNSERVABLE_EVENT_CODES,
      caseDetail: {
        docketRecord: [],
        documents: [{ documentId }],
      },
      correrspondenceDocumentId,
      draftDocuments: [{ documentId }],
    });

    expect(showNotServed).toEqual(false);
  });
});
