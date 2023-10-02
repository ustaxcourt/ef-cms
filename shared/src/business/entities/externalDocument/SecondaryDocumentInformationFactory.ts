import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { includes } from 'lodash';
import { makeRequiredHelper } from './externalDocumentHelpers';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
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

  getValidationRules_NEW() {
    let schema = {};

    let schemaOptionalItems = {
      attachments: joi
        .boolean()
        .messages(setDefaultErrorMessages('Enter selection for Attachments.')),
      certificateOfService: joi
        .boolean()
        .messages(
          setDefaultErrorMessages(
            'Indicate whether you are including a Certificate of Service',
          ),
        ),
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max(
        'now',
      ).messages({
        ...setDefaultErrorMessages('Enter date of service'),
        'date.max':
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      }),
      objections: JoiValidationConstants.STRING.messages(
        setDefaultErrorMessages('Enter selection for Objections.'),
      ),
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
