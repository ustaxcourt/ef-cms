import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

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

export type HealthCheckResponseData = {
  cognito: boolean;
  elasticsearch: boolean;
  emailService: boolean;
  s3: S3BucketsStatusDTO;
};

const S3_STATUS_RULES = {
  app: joi.boolean().required(),
  appFailover: joi.boolean().required(),
  eastDocuments: joi.boolean().required(),
  eastTempDocuments: joi.boolean().required(),
  public: joi.boolean().required(),
  publicFailover: joi.boolean().required(),
  westDocuments: joi.boolean().required(),
  westTempDocuments: joi.boolean().required(),
};

export class HealthCheckResponse
  extends JoiValidationEntity
  implements HealthCheckResponseData
{
  cognito: boolean;
  elasticsearch: boolean;
  emailService: boolean;
  s3: S3BucketsStatusDTO;

  constructor(data: HealthCheckResponseData) {
    super('HealthCheckResponse');
    this.cognito = data.cognito;
    this.elasticsearch = data.elasticsearch;
    this.emailService = data.emailService;
    this.s3 = {
      app: data.s3.app,
      appFailover: data.s3.appFailover,
      eastDocuments: data.s3.eastDocuments,
      eastTempDocuments: data.s3.eastTempDocuments,
      public: data.s3.public,
      publicFailover: data.s3.publicFailover,
      westDocuments: data.s3.westDocuments,
      westTempDocuments: data.s3.westTempDocuments,
    };
  }

  static VALIDATION_RULES = {
    cognito: joi.boolean().required(),
    elasticsearch: joi.boolean().required(),
    emailService: joi.boolean().required(),
    s3: joi.object(S3_STATUS_RULES).required(),
  };

  getValidationRules() {
    return HealthCheckResponse.VALIDATION_RULES;
  }
}
