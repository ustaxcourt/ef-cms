import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { INTERNAL_OBJECTION_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
export const filingPartiesFormHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { partyType } = get(state.caseDetail);
  const validationErrors = get(state.validationErrors);
  const form = get(state.form);

  const { AMENDMENT_EVENT_CODES, AMICUS_BRIEF_EVENT_CODE, PARTY_TYPES } =
    applicationContext.getConstants();

  const partyValidationError =
    validationErrors &&
    (validationErrors.filers ||
      validationErrors.partyIrsPractitioner ||
      validationErrors.otherFilingParty);

  const isServed = DocketEntry.isServed(form);

  const showSecondaryParty =
    partyType === PARTY_TYPES.petitionerSpouse ||
    partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const showFilingPartiesAsCheckboxes =
    form.eventCode !== AMICUS_BRIEF_EVENT_CODE;

  const isObjectionType =
    INTERNAL_OBJECTION_DOCUMENT_TYPES.has(form.documentType) ||
    (AMENDMENT_EVENT_CODES.includes(form.eventCode) &&
      INTERNAL_OBJECTION_DOCUMENT_TYPES.has(
        form.previousDocument?.documentType,
      ));

  return {
    isServed,
    noMargin: isObjectionType,
    partyValidationError,
    showFilingPartiesAsCheckboxes,
    showSecondaryParty,
  };
};
