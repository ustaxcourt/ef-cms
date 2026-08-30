import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class PublicDocketRecordPdfJobResponse extends JoiValidationEntity {
  status?: 'pending' | 'ready' | 'error';
  jobId?: string;
  url?: string;
  message?: string;
  statusCode?: number;

  constructor(data: {
    status?: 'pending' | 'ready' | 'error';
    jobId?: string;
    url?: string;
    message?: string;
    statusCode?: number;
  }) {
    super('PublicDocketRecordPdfJobResponse');
    this.status = data.status;
    this.jobId = data.jobId;
    this.url = data.url;
    this.message = data.message;
    this.statusCode = data.statusCode;
  }

  static VALIDATION_RULES = {
    jobId: JoiValidationConstants.STRING.optional(),
    message: JoiValidationConstants.STRING.optional(),
    status: JoiValidationConstants.STRING.valid(
      'pending',
      'ready',
      'error',
    ).optional(),
    statusCode: joi.number().integer().optional(),
    url: JoiValidationConstants.STRING.uri().optional(),
  };

  getValidationRules() {
    return PublicDocketRecordPdfJobResponse.VALIDATION_RULES;
  }
}
