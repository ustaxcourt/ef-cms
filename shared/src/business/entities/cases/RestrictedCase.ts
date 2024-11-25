import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

// TODO 10502: implement caseSealedFormatter(caseRecord) here rather than in getCaseInteractor

// An entity for case details for a case a user does not have access to
export class RestrictedCase extends JoiValidationEntity {
  getValidationRules() {
    throw new Error('Method not implemented.');
  }
}
