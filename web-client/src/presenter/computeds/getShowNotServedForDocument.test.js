import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShowNotServedForDocument } from './getShowNotServedForDocument';

describe('getShowNotServedForDocument', () => {
  const docketEntryId = applicationContext.getUniqueId();

  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  describe('showNotServed', () => {
    it('should return true for showNotServed if the document type is servable and does not have a servedAt', () => {
      const showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentTitle: 'Some Stuff',
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
        docketEntryId,
        draftDocuments: [],
      });

      expect(showNotServed).toEqual(true);
    });

    it('should return false for showNotServed if the document type is unservable', () => {
      const showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentTitle: 'Some Stuff',
              documentType: 'Corrected Transcript',
              eventCode: 'CTRA',
            },
          ],
        },
        docketEntryId,
        draftDocuments: [],
      });

      expect(showNotServed).toEqual(false);
    });

    it('should return false for showNotServed if the document type is servable and has servedAt', () => {
      const showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentTitle: 'Some Stuff',
              documentType: 'Order',
              eventCode: 'O',
              servedAt: '2019-03-01T21:40:46.415Z',
            },
          ],
        },
        docketEntryId,
        draftDocuments: [],
      });

      expect(showNotServed).toEqual(false);
    });

    it('should return false for showNotServed if the document type is servable and not served and the document is a draft', () => {
      const showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketEntries: [
            {
              docketEntryId,
              documentTitle: 'Some Stuff',
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
        docketEntryId,
        draftDocuments: [{ docketEntryId }],
      });

      expect(showNotServed).toEqual(false);
    });

    it('should return false for showNotServed if the document is not on the case detail', () => {
      const showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketEntries: [],
        },
        docketEntryId,
        draftDocuments: [{ docketEntryId }],
      });

      expect(showNotServed).toEqual(false);
    });

    it('should return false when the document is a correspondence document', () => {
      // Correspondence documents should not be in case.docketEntries and also are not served
      const correspondenceDocumentId = applicationContext.getUniqueId();

      const showNotServed = getShowNotServedForDocument({
        UNSERVABLE_EVENT_CODES,
        caseDetail: {
          docketEntries: [{ docketEntryId }],
        },
        docketEntryId: correspondenceDocumentId,
        draftDocuments: [{ docketEntryId }],
      });

      expect(showNotServed).toEqual(false);
    });
  });
});
