import { EXTERNAL_FILING_EVENTS } from '@shared/business/entities/docketEntry/externalFilingEvents';
import { INTERNAL_FILING_EVENTS } from '@shared/business/entities/docketEntry/internalFilingEvents';
import {
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const refreshExternalDocumentTitleFromEventCodeAction = ({
  get,
  store,
}: ActionProps) => {
  const { category, eventCode } = get(state.form);

  const eventCodeMatches = docketEntry => docketEntry.eventCode === eventCode;

  const isPractitionerAssociationDocument =
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.find(eventCodeMatches);

  if (category && eventCode && !isPractitionerAssociationDocument) {
    const internalAndExternalFilingEventForCategory = [
      ...EXTERNAL_FILING_EVENTS[category],
      ...INTERNAL_FILING_EVENTS[category],
    ];

    const categoryInformation =
      internalAndExternalFilingEventForCategory.find(eventCodeMatches);
    store.set(state.form.documentTitle, categoryInformation?.documentTitle);
  }

  // edge case for notice of receipt of petition in edit internal docket entry form
  if (eventCode === 'NOTR') {
    store.set(
      state.form.documentTitle,
      SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfReceiptOfPetition.documentTitle,
    );
  }

  const secondaryDocument = get(state.form.secondaryDocument);
  if (
    secondaryDocument &&
    secondaryDocument.category &&
    secondaryDocument.eventCode
  ) {
    const internalAndExternalFilingEventForCategory = [
      ...EXTERNAL_FILING_EVENTS[secondaryDocument.category],
      ...INTERNAL_FILING_EVENTS[secondaryDocument.category],
    ];

    const categoryInformation = internalAndExternalFilingEventForCategory.find(
      docketEntry => docketEntry.eventCode === secondaryDocument.eventCode,
    );

    store.set(
      state.form.secondaryDocument.documentTitle,
      categoryInformation?.documentTitle,
    );
  }
};
