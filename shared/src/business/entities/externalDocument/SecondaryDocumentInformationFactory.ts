import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { includes } from 'lodash';
import { makeRequiredHelper } from './externalDocumentHelpers';
import joi from 'joi';

export class SecondaryDocumentInformationFactory extends JoiValidationEntity {
  public attachments: string;
  public category: string;
  public certificateOfService?: boolean;
  public certificateOfServiceDate: string;
  public documentType: string;
  public objections: string;
  public secondaryDocumentFile?: object;

  private secondaryDocumentErrorMessages: object;

  constructor(rawProps, errorMessages) {
    super('SecondaryDocumentInformationFactory');
    this.attachments = rawProps.attachments || false;
    this.category = rawProps.category;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentType = rawProps.documentType;
    this.objections = rawProps.objections;
    this.secondaryDocumentFile = rawProps.secondaryDocumentFile;

    this.secondaryDocumentErrorMessages = errorMessages;
  }

  getValidationRules() {
    let schema = {};

    let schemaOptionalItems = {
      attachments: joi.boolean(),
      certificateOfService: joi.boolean(),
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
      objections: JoiValidationConstants.STRING,
    };

    const makeRequired = itemName => {
      makeRequiredHelper({
        itemName,
        schema,
        schemaOptionalItems,
      });
    };

    if (this.secondaryDocumentFile) {
      makeRequired('attachments');
      makeRequired('certificateOfService');

      if (this.certificateOfService === true) {
        makeRequired('certificateOfServiceDate');
      }

      if (
        this.category === 'Motion' ||
        includes(
          [
            'Motion to Withdraw Counsel',
            'Motion to Withdraw As Counsel',
            'Application to Take Deposition',
          ],
          this.documentType,
        )
      ) {
        makeRequired('objections');
      }
    }
    return schema;
  }

  getErrorToMessageMap() {
    return this.secondaryDocumentErrorMessages;
  }
}
