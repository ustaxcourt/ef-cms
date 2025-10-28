import { Get } from 'cerebral';
import { uniqBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';

/**
 * Returns computed values for the confirm initiate court issued filing service modal
 *
 * @param {Function} get the cerebral get function used
 * @param {object} applicationContext the application context
 * @returns {object} the computed values
 */

export const confirmInitiateServiceModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    CONTACT_TYPE_TITLES,
    NON_MULTI_DOCKETABLE_EVENT_CODES,
    SIMULTANEOUS_DOCUMENT_EVENT_CODES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const { isCourtIssued } = applicationContext.getUtilities();

  const docketEntryId = get(state.docketEntryId);
  const formattedCaseDetail = get(state.formattedCaseDetail);
  const form = get(state.form);

  const isOnMessageDetailPage = get(state.currentPage) === 'MessageDetail';
  let { documentTitle, eventCode } = form;
  if (!eventCode) {
    ({ documentTitle, eventCode } = formattedCaseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    ));
  }

  let showConsolidatedCasesForService =
    formattedCaseDetail.isLeadCase &&
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode) &&
    !isOnMessageDetailPage;

  if (!isCourtIssued(eventCode)) {
    if (
      (SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(eventCode) ||
        documentTitle?.includes('Simultaneous')) &&
      !form.isPaper
    ) {
      showConsolidatedCasesForService = false;
    }
  }

  let additionalServedCases: { docketNumber: string; caseTitle: string }[] = [];
  if (
    SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(eventCode) ||
    documentTitle?.includes('Simultaneous')
  ) {
    if (Array.isArray(formattedCaseDetail.consolidatedCases)) {
      additionalServedCases = formattedCaseDetail.consolidatedCases
        .filter((c: any) => c.docketNumber !== formattedCaseDetail.docketNumber)
        .map((c: any) => ({
          docketNumber: c.docketNumber,
          caseTitle: c.caseTitle,
        }));
    }
  }

  const confirmationText = showConsolidatedCasesForService
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  let parties;
  if (showConsolidatedCasesForService) {
    const modalForm = get(state.modal.form) || {};
    const { consolidatedCasesToMultiDocketOn = [] } = modalForm as {
      consolidatedCasesToMultiDocketOn?: Array<{
        checked: boolean;
        docketNumber: string;
      }>;
    };

    const paperServiceParties: {
      contactId: string;
      userId: string;
      name: string;
    }[] = [];

    consolidatedCasesToMultiDocketOn.forEach(aCase => {
      if (aCase.checked) {
        const caseDetail = [
          ...formattedCaseDetail.consolidatedCases,
          formattedCaseDetail,
        ].find(
          checkboxCase => checkboxCase.docketNumber === aCase.docketNumber,
        );

        const checkboxPaperServiceParties = getPaperServiceParties(caseDetail);
        paperServiceParties.push(...checkboxPaperServiceParties);
      }
    });

    const paperServicePetitioners = paperServiceParties.filter(
      party => party.contactId,
    );
    const paperServicePractitioners = paperServiceParties.filter(
      party => party.userId,
    );

    parties = [
      ...uniqBy(paperServicePetitioners, 'contactId'),
      ...uniqBy(paperServicePractitioners, 'userId'),
    ];
  } else {
    parties = getPaperServiceParties(formattedCaseDetail);
  }

  const contactsNeedingPaperService: { name: string }[] = [];

  const roleToDisplay = party => {
    if (party.role === USER_ROLES.privatePractitioner) {
      return 'Petitioner Counsel';
    } else if (party.role === USER_ROLES.irsPractitioner) {
      return 'Respondent Counsel';
    } else {
      return CONTACT_TYPE_TITLES[party.contactType];
    }
  };

  parties.forEach(party => {
    contactsNeedingPaperService.push({
      name: `${party.name}, ${roleToDisplay(party)}`,
    });
  });

  let caseOrGroup = 'case';
  if (showConsolidatedCasesForService) {
    const modalForm = get(state.modal.form) || {};
    const { consolidatedCasesToMultiDocketOn = [] } = modalForm as {
      consolidatedCasesToMultiDocketOn?: Array<{
        checked: boolean;
        docketNumber: string;
      }>;
    };

    if (consolidatedCasesToMultiDocketOn.filter(c => c.checked).length > 1) {
      caseOrGroup = 'group';
    }
  }

  const paperPartiesConsolidated =
    getPaperPartiesConsolidated(formattedCaseDetail);

  return {
    caseOrGroup,
    confirmationText,
    contactsNeedingPaperService,
    showConsolidatedCasesForService,
    showPaperAlert: contactsNeedingPaperService.length > 0,
    additionalServedCases,
    paperPartiesConsolidated:
      paperPartiesConsolidated.length > 0
        ? paperPartiesConsolidated
        : undefined,
  };
};

const getPaperServiceParties = rawCase => {
  const allParties = [
    ...(rawCase.irsPractitioners || []),
    ...(rawCase.petitioners || []),
    ...(rawCase.privatePractitioners || []),
  ];

  const paperServiceParties = allParties.filter(
    person => person.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  return paperServiceParties;
};

const getPaperPartiesConsolidated = formattedCaseDetail => {
  const paperPartiesConsolidated: Array<{
    contactId?: string;
    userId?: string;
    name: string;
    contactType?: string;
    serviceIndicator: string;
    docketNumber: string;
  }> = [];

  if (!formattedCaseDetail?.consolidatedCases) return paperPartiesConsolidated;

  for (const caseItem of formattedCaseDetail.consolidatedCases) {
    const {
      irsPractitioners = [],
      petitioners = [],
      privatePractitioners = [],
      docketNumber,
    } = caseItem;

    const allParties = [
      ...irsPractitioners,
      ...petitioners,
      ...privatePractitioners,
    ];

    allParties
      .filter(
        person => person.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
      )
      .forEach(person => {
        paperPartiesConsolidated.push({
          ...person,
          docketNumber,
        });
      });
  }

  return paperPartiesConsolidated;
};
