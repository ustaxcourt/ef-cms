import { JoiValidationEntity } from '../JoiValidationEntity';

export abstract class CaseAssociationRequestDocument extends JoiValidationEntity {
  abstract getDocumentTitle(
    petitioners?: { contactId: string; name: string }[],
  ): string;
}
