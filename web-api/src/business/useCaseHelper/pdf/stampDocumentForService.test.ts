import { SERVICE_STAMP_OPTIONS } from '../../../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { stampDocumentForService } from './stampDocumentForService';

describe('stampDocumentForService', () => {
  it('should set `Served` as the stamp text when the documentType is NOT order and the document eventCode is not one of ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await stampDocumentForService({
      applicationContext,
      docketEntryId: '34ceb7ca-20a7-42cb-b69c-a726991f245f',
      documentToStamp: {
        documentType: 'Motion to Withdraw as Counsel',
        eventCode: 'M112',
        serviceStamp: SERVICE_STAMP_OPTIONS[0],
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain('Served');
  });

  it('should set stamp text from the document when the documentType is Order', async () => {
    const mockServiceStamp = 'This document is urgent!';

    await stampDocumentForService({
      applicationContext,
      docketEntryId: 'e7107cab-1e26-40be-bd06-eda0f6b439e0',
      documentToStamp: {
        documentType: 'Order',
        eventCode: 'O',
        serviceStamp: mockServiceStamp,
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain(mockServiceStamp);
  });

  it('should set `Entered and Served` as the stamp text when the eventCode is in ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await stampDocumentForService({
      applicationContext,
      docketEntryId: '999d79bd-5699-438b-8a57-c6ffb3eb9514',
      documentToStamp: {
        documentType: 'Order of Dismissal for Lack of Jurisdiction',
        eventCode: 'ODJ',
        serviceStamp: SERVICE_STAMP_OPTIONS[0],
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain('Entered and Served');
  });

  it('should include the date served as today, formatted as "MMDDYY" in the service stamp', async () => {
    const mockToday = '2009-03-01T21:40:46.415Z';
    const mockTodayFormatted = applicationContext
      .getUtilities()
      .formatDateString(mockToday, 'MMDDYY');

    applicationContext
      .getUtilities()
      .createISODateString.mockReturnValue(mockToday);

    await stampDocumentForService({
      applicationContext,
      docketEntryId: '1ed90cf7-2816-4e1b-a777-4ae3229b05eb',
      documentToStamp: {
        documentType: 'Order of Dismissal for Lack of Jurisdiction',
        eventCode: 'ODJ',
        serviceStamp: SERVICE_STAMP_OPTIONS[0],
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain(mockTodayFormatted);
  });
});
