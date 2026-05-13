import { createAndUploadMinuteSheet } from './createAndUploadMinuteSheet';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { NotFoundError } from '@web-api/errors/errors';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { formatMinuteSheet } from './formatMinuteSheet';
import { minuteSheet as minuteSheetDocumentGenerator } from '@web-api/business/utilities/documentGenerators/minuteSheet';
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';
import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';
import { mockFormattedMinuteSheet } from './mockFormattedMinuteSheet';

jest.mock('@web-api/persistence/postgres/minuteSheets/getMinuteSheet');
jest.mock(
  '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet',
);
jest.mock('@web-api/business/utilities/documentGenerators/minuteSheet');
jest.mock('@web-api/persistence/s3/uploadDocument');

describe('createAndUploadMinuteSheet', () => {
  const mockParams = {
    docketNumber: '123-45',
    trialSessionId: 'trial-123',
    aCase: { caseId: 'case-123' },
    trialSession: { trialSessionId: 'trial-123' },
    documentStorageId: 'docket-entry-123',
  };
  const mockGetMinuteSheetValue = {
    content: mockMinuteSheet,
    docketNumber: mockParams.docketNumber,
    trialSessionId: mockParams.trialSessionId,
  };

  const mockGetMinuteSheet = jest.mocked(getMinuteSheet);
  const mockFormatMinuteSheet = jest.mocked(formatMinuteSheet);
  const mockMinuteSheetDocumentGenerator = jest.mocked(
    minuteSheetDocumentGenerator,
  );
  const mockUploadDocument = jest.mocked(uploadDocument);

  beforeEach(() => {
    mockGetMinuteSheet.mockResolvedValue(mockGetMinuteSheetValue);
    mockFormatMinuteSheet.mockReturnValue(mockFormattedMinuteSheet);
    mockMinuteSheetDocumentGenerator.mockResolvedValue(
      'pdf data' as unknown as Uint8Array,
    );
  });

  it('throw not found error if minute sheet is not found', async () => {
    mockGetMinuteSheet.mockResolvedValue(undefined);
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
        formattedMinuteSheet: mockFormattedMinuteSheet,
      },
    });
    expect(mockUploadDocument).toHaveBeenCalledWith({
      applicationContext,
      pdfData: 'pdf data',
      key: mockParams.documentStorageId,
    });
    expect(result).toBe('pdf data');
  });
});
