import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';
import { state } from '@web-client/presenter/app.cerebral';
import { find, filter, orderBy, flow } from 'lodash';
import { MOTION_DISPOSITIONS } from '@shared/business/entities/EntityConstants';

export const addCourtIssuedDocketEntryHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    COURT_ISSUED_EVENT_CODES,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const caseDetail = setServiceIndicatorsForPetitionersOnCase({
    ...get(state.caseDetail),
  });

  const selectedEventCode = get(state.form.eventCode);
  const affectedDocketEntries = get(state.form.affectedDocketEntries);
  const generatedDocumentTitle = get(state.form.generatedDocumentTitle);
  const attachments = get(state.form.attachments);

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

  const caseMotions = flow([
    (docketEntries: RawDocketEntry[]) =>
      filter(
        docketEntries,
        d =>
          DocketEntry.isMotion(d.eventCode) &&
          !d.isStricken &&
          !d.isDraft &&
          !find(
            // Motions not already in the order
            affectedDocketEntries ?? [],
            am => am.docketEntryId === d.docketEntryId,
          ),
      ),
    docketEntries => orderBy(docketEntries, ['index'], ['desc']),
    docketEntries =>
      docketEntries.map((m: RawDocketEntry) => ({
        label: `${m.index} - ${m.documentTitle}`,
        value: m.docketEntryId,
      })),
  ])(caseDetail.docketEntries);

  const serviceParties = [
    ...petitioners,
    ...(caseDetail.privatePractitioners ?? []).map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Petitioner Counsel`,
    })),
    ...(caseDetail.irsPractitioners ?? []).map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Respondent Counsel`,
    })),
  ];

  const showServiceStamp =
    selectedEventCode === 'O' && user.role !== USER_ROLES.petitionsClerk;

  const formattedDocumentTitle = `${generatedDocumentTitle || ''}${
    attachments ? ' (Attachment(s))' : ''
  }`;

  const eventCodeIsUnservable = DocketEntry.isUnservable({
    eventCode: selectedEventCode,
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
    selectedEventCode !==
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