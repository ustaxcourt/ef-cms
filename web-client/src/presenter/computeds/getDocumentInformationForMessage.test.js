import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentInformationForMessage } from './getDocumentInformationForMessage';

describe('getDocumentInformationForMessage', () => {
  const documentId = applicationContext.getUniqueId();

  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  describe('showNotServed', () => {
    it('should return true for showNotServed if the document type is servable and does not have a servedAt', () => {
      const { showNotServed } = getDocumentInformationForMessage({
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

    it('should return false for showNotServed if the document type is unservable', () => {
      const { showNotServed } = getDocumentInformationForMessage({
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

    it('should return false for showNotServed if the document type is servable and has servedAt', () => {
      const { showNotServed } = getDocumentInformationForMessage({
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

    it('should return false for showNotServed if the document type is servable and not served and the document is a draft', () => {
      const { showNotServed } = getDocumentInformationForMessage({
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

    it('should return false for showNotServed if the document is not on the case detail', () => {
      const { showNotServed } = getDocumentInformationForMessage({
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

      const { showNotServed } = getDocumentInformationForMessage({
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

  describe('isArchived', () => {
    it('should return true for isArchived when the document has been archived', () => {
      const { isArchived } = getDocumentInformationForMessage({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketRecord: [{ documentId }],
          documents: [
            {
              archived: true,
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

      expect(isArchived).toBeTruthy();
    });

    it('should return false for isArchived when the document has not been archived', () => {
      const { isArchived } = getDocumentInformationForMessage({
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

      expect(isArchived).toBeFalsy();
    });
  });
});
