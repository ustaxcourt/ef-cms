import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export abstract class CaseAssociationRequestDocument extends JoiValidationEntity {
  abstract getDocumentTitle(
    petitioners?: { contactId: string; name: string }[],
  ): string;
}
