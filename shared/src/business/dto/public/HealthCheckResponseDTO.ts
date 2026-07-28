export type S3BucketsStatusDTO = {
  app: boolean;
  appFailover: boolean;
  eastDocuments: boolean;
  eastTempDocuments: boolean;
  public: boolean;
  publicFailover: boolean;
  westDocuments: boolean;
  westTempDocuments: boolean;
};

export type HealthCheckResponseDTOType = {
  cognito: boolean;
  elasticsearch: boolean;
  emailService: boolean;
  s3: S3BucketsStatusDTO;
};

export class HealthCheckResponseDTO implements HealthCheckResponseDTOType {
  entityName: 'HealthCheckResponseDTO' = 'HealthCheckResponseDTO';
  cognito: boolean;
  elasticsearch: boolean;
  emailService: boolean;
  s3: S3BucketsStatusDTO;

  constructor(data: HealthCheckResponseDTOType) {
    this.cognito = data.cognito;
    this.elasticsearch = data.elasticsearch;
    this.emailService = data.emailService;
    this.s3 = data.s3;
    this.entityName = 'HealthCheckResponseDTO';
  }
}
