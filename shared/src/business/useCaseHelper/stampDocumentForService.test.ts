import { ENTERED_AND_SERVED_EVENT_CODES } from '../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { stampDocumentForService } from './stampDocumentForService';

describe('stampDocumentForService', () => {
  it('should set `Served` as the stamp text when the documentType is NOT order and the document eventCode is not one of ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await stampDocumentForService({
      applicationContext,
      documentToStamp: {
        documentType: 'Motion to Withdraw as Counsel',
        eventCode: 'M112',
      },
      pdfData: {},
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
      documentToStamp: {
        documentType: 'Order',
        serviceStamp: mockServiceStamp,
      },
      pdfData: {},
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain(mockServiceStamp);
  });

  it('should set `Entered and Served` as the stamp text when the eventCode is in ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await stampDocumentForService({
      applicationContext,
      documentToStamp: {
        eventCode: ENTERED_AND_SERVED_EVENT_CODES[0],
      },
      pdfData: {},
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
      documentToStamp: {},
      pdfData: {},
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain(mockTodayFormatted);
  });
});
