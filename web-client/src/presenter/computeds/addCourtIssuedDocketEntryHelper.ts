import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';
import { state } from '@web-client/presenter/app.cerebral';
import _ from 'lodash';

export const addCourtIssuedDocketEntryHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    COURT_ISSUED_EVENT_CODES,
    MOTION_DISPOSITIONS,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const caseDetail = setServiceIndicatorsForPetitionersOnCase({
    ...get(state.caseDetail),
  });

  const form = get(state.form);

  const user = get(state.user);

  const eventCodes = COURT_ISSUED_EVENT_CODES;

  const documentTypes = eventCodes.map(type => ({
    ...type,
    label: type.documentType,
    value: type.eventCode,
  }));

  const petitioners = applicationContext
    .getUtilities()
    .getFormattedPartiesNameAndTitle({ petitioners: caseDetail.petitioners });

  const relatedMotionDispositions = Object.values(MOTION_DISPOSITIONS).map(
    d => ({ label: d, value: d }),
  );
  const caseMotions = caseDetail.docketEntries
    .filter(
      d =>
        DocketEntry.isMotion(d.eventCode) &&
        !d.isStricken &&
        !d.isDraft &&
        !_.find(
          // Motions not already in the order
          form.affectedDocketEntries ?? [],
          am => am.docketEntryId === d.docketEntryId,
        ),
    )
    .map((m: RawDocketEntry) => ({
      label: `${m.index} - ${m.documentTitle}`,
      value: m.docketEntryId,
    }));

  const serviceParties = [
    ...petitioners,
    ...caseDetail.privatePractitioners.map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Petitioner Counsel`,
    })),
    ...caseDetail.irsPractitioners.map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Respondent Counsel`,
    })),
  ];

  const selectedEventCode = get(state.form.eventCode);
  const showServiceStamp =
    selectedEventCode === 'O' && user.role !== USER_ROLES.petitionsClerk;

  const formattedDocumentTitle = `${form.generatedDocumentTitle || ''}${
    form.attachments ? ' (Attachment(s))' : ''
  }`;

  const eventCodeIsUnservable = DocketEntry.isUnservable({
    eventCode: form.eventCode,
  });

  const eventCodesNotRequiringAttachmentsAndService = ['TCRP'];

  const showAttachmentAndServiceFields =
    !eventCodesNotRequiringAttachmentsAndService.includes(selectedEventCode);

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);
  const showServiceWarning = !canAllowDocumentServiceForCase;
  const showReceivedDate = eventCodeIsUnservable;
  const showSaveAndServeButton =
    !eventCodeIsUnservable && canAllowDocumentServiceForCase;

  const showDocumentTypeDropdown =
    form.eventCode !==
    SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.eventCode;

  return {
    documentTypes,
    formattedDocumentTitle,
    caseMotions,
    relatedMotionDispositions,
    serviceParties,
    showAttachmentAndServiceFields,
    showDocumentTypeDropdown,
    showReceivedDate,
    showSaveAndServeButton,
    showServiceStamp,
    showServiceWarning,
  };
};
