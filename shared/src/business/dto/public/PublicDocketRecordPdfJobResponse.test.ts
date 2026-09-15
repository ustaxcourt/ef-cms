import { PublicDocketRecordPdfJobResponse } from './PublicDocketRecordPdfJobResponse';

describe('PublicDocketRecordPdfJobResponse', () => {
  it('is valid with no data because all fields are optional', () => {
    const dto = new PublicDocketRecordPdfJobResponse({});

    expect(dto.entityName).toBe('PublicDocketRecordPdfJobResponse');
    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is valid with supported status, job id, url, message, and integer status code', () => {
    const dto = new PublicDocketRecordPdfJobResponse({
      jobId: 'job-123',
      message: 'Your PDF is ready',
      status: 'ready',
      statusCode: 200,
      url: 'https://example.com/public-docket-record.pdf',
    });

    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is invalid when status is unsupported', () => {
    const dto = new PublicDocketRecordPdfJobResponse({
      status: 'complete' as unknown as 'pending' | 'ready' | 'error',
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        status: expect.any(String),
      }),
    );
  });

  it('is invalid when url is not a valid uri or statusCode is not an integer', () => {
    const dto = new PublicDocketRecordPdfJobResponse({
      statusCode: 200.5,
      url: 'not-a-uri',
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        statusCode: expect.any(String),
        url: expect.any(String),
      }),
    );
  });
});
