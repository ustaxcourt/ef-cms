import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class IrsCalendarAdministratorInfo extends JoiValidationEntity {
  public name: string;
  public email: string;
  public phone: string;

  constructor(rawData: any) {
    super('IrsCalendarAdministratorInfo');

    this.name = rawData.name;
    this.email = rawData.email;
    this.phone = rawData.phone;
  }

  static VALIDATIONS = {
    email: JoiValidationConstants.STRING.max(100).optional(),
    name: JoiValidationConstants.STRING.max(100).optional(),
    phone: JoiValidationConstants.STRING.max(100).optional(),
  };

  getValidationRules() {
    return IrsCalendarAdministratorInfo.VALIDATIONS;
  }
}

export type RawIrsCalendarAdministratorInfo = Omit<
  ExcludeMethods<IrsCalendarAdministratorInfo>,
  'entityName'
>;
