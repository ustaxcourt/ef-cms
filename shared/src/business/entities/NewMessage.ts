import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { Message } from './Message';

export class NewMessage extends JoiValidationEntity {
  public message: string;
  public subject: string;
  public toSection: string;
  public toUserId: string;

  constructor(rawMessage) {
    super('NewMessage');

    this.message = rawMessage.message;
    this.subject = rawMessage.subject;
    this.toSection = rawMessage.toSection;
    this.toUserId = rawMessage.toUserId;
  }

  getValidationRules() {
    return {
      entityName: JoiValidationConstants.STRING.valid('NewMessage').required(),
      message: Message.VALIDATION_RULES.message,
      subject: Message.VALIDATION_RULES.subject,
      toSection: Message.VALIDATION_RULES.toSection,
      toUserId: Message.VALIDATION_RULES.toUserId,
    };
  }
}
