import { HealthCheckResponse } from './HealthCheckResponse';

describe('HealthCheckResponse', () => {
  const validData = {
    cognito: true,
    elasticsearch: true,
    emailService: true,
    s3: {
      app: true,
      appFailover: true,
      eastDocuments: true,
      eastTempDocuments: true,
      public: true,
      publicFailover: true,
      westDocuments: true,
      westTempDocuments: true,
    },
  };

  it('maps values and validates when all required fields are present', () => {
    const dto = new HealthCheckResponse(validData);

    expect(dto.entityName).toBe('HealthCheckResponse');
    expect(dto).toMatchObject(validData);
    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is invalid when a required top-level field is missing', () => {
    const dto = new HealthCheckResponse({
      ...validData,
      cognito: undefined,
    } as unknown as typeof validData);

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        cognito: expect.any(String),
      }),
    );
  });

  it('is invalid when an s3 bucket status is missing', () => {
    const dto = new HealthCheckResponse({
      ...validData,
      s3: {
        ...validData.s3,
        westTempDocuments: undefined,
      },
    } as unknown as typeof validData);

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        's3-westTempDocuments': expect.any(String),
      }),
    );
  });
});
