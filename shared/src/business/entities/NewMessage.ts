import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { Message } from './Message';

/**
 * NewMessage entity - used for validating
 * the Create Message modal form
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
export class NewMessage extends JoiValidationEntity {
  getValidationRules() {
    return {
      entityName: JoiValidationConstants.STRING.valid('NewMessage').required(),
      message: Message.VALIDATION_RULES.message,
      subject: Message.VALIDATION_RULES.subject,
      toSection: Message.VALIDATION_RULES.toSection,
      toUserId: Message.VALIDATION_RULES.toUserId,
    };
  }

  getValidationRules_NEW() {
    return {
      entityName: JoiValidationConstants.STRING.valid('NewMessage').required(),
      message: Message.VALIDATION_RULES_NEW.message,
      subject: Message.VALIDATION_RULES_NEW.subject,
      toSection: Message.VALIDATION_RULES_NEW.toSection,
      toUserId: Message.VALIDATION_RULES_NEW.toUserId,
    };
  }

  getErrorToMessageMap() {
    return Message.VALIDATION_ERROR_MESSAGES;
  }
  public message: string;
  public subject: string;
  public toSection: string;
  public toUserId: string;

  constructor(rawMessage, { applicationContext }) {
    super('NewMessage');
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.message = rawMessage.message;
    this.subject = rawMessage.subject;
    this.toSection = rawMessage.toSection;
    this.toUserId = rawMessage.toUserId;
  }

  static VALIDATION_ERROR_MESSAGES = Message.VALIDATION_ERROR_MESSAGES;
}
