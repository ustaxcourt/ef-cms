import { createAndUploadMinuteSheet } from './createAndUploadMinuteSheet';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { NotFoundError } from '@web-api/errors/errors';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { formatMinuteSheet } from './formatMinuteSheet';
import { minuteSheet as minuteSheetDocumentGenerator } from '@shared/business/utilities/documentGenerators/minuteSheet';
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';

jest.mock('@web-api/persistence/postgres/minuteSheets/getMinuteSheet');
jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet',
);
jest.mock('@shared/business/utilities/documentGenerators/minuteSheet');
jest.mock('@web-api/persistence/s3/uploadDocument');

describe('createAndUploadMinuteSheet', () => {
  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
    aCase: { caseId: 'case-123' },
    trialSession: { trialSessionId: 'trial-123' },
    docketEntryId: 'docket-entry-123',
  };
  const mockGetMinuteSheetValue = {
    content: 'mocked minute sheet content',
  };

  const mockGetMinuteSheet = getMinuteSheet as jest.Mock;
  const mockFormatMinuteSheet = formatMinuteSheet as jest.Mock;
  const mockMinuteSheetDocumentGenerator =
    minuteSheetDocumentGenerator as jest.Mock;
  const mockUploadDocument = uploadDocument as jest.Mock;

  beforeEach(() => {
    mockGetMinuteSheet.mockResolvedValue(mockGetMinuteSheetValue);
    mockFormatMinuteSheet.mockReturnValue('formatted minute sheet');
    mockMinuteSheetDocumentGenerator.mockResolvedValue('pdf data');
  });

  it('throw not found error if minute sheet is not found', async () => {
    mockGetMinuteSheet.mockResolvedValue(null);
    await expect(
      createAndUploadMinuteSheet(applicationContext, mockParams),
    ).rejects.toThrow(NotFoundError);
  });

  it('uploads the document and returns the PDF', async () => {
    const result = await createAndUploadMinuteSheet(
      applicationContext,
      mockParams,
    );
    expect(mockGetMinuteSheet).toHaveBeenCalledWith({
      docketNumber: mockParams.docketNumber,
      trialSessionId: mockParams.trialSessionId,
    });
    expect(mockFormatMinuteSheet).toHaveBeenCalledWith({
      aCase: mockParams.aCase,
      minuteSheet: mockGetMinuteSheetValue.content,
      trialSession: mockParams.trialSession,
    });
    expect(mockMinuteSheetDocumentGenerator).toHaveBeenCalledWith({
      applicationContext,
      data: {
        formattedMinuteSheet: 'formatted minute sheet',
      },
    });
    expect(mockUploadDocument).toHaveBeenCalledWith({
      applicationContext,
      pdfData: 'pdf data',
      pdfName: mockParams.docketEntryId,
    });
    expect(result).toBe('pdf data');
  });
});
