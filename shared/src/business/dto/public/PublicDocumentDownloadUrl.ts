import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class PublicDocumentDownloadUrl extends JoiValidationEntity {
  url: string;

  constructor(data: { url: string }) {
    super('PublicDocumentDownloadUrl');
    this.url = data.url;
  }

  static VALIDATION_RULES = {
    url: JoiValidationConstants.STRING.uri().required(),
  };

  getValidationRules() {
    return PublicDocumentDownloadUrl.VALIDATION_RULES;
  }
}
