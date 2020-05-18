import {
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  SECTIONS,
} from '../../shared/src/business/entities/WorkQueue';
import { Case } from '../../shared/src/business/entities/cases/Case';
import { CaseInternal } from '../../shared/src/business/entities/cases/CaseInternal';
import { CaseSearch } from '../../shared/src/business/entities/cases/CaseSearch';
import { ContactFactory } from '../../shared/src/business/entities/contacts/ContactFactory';
import { Document } from '../../shared/src/business/entities/Document';
import { FORMATS } from '../../shared/src/business/utilities/DateHandler';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '../../shared/src/persistence/s3/getUploadPolicy';
import { Order } from '../../shared/src/business/entities/orders/Order';
import { Practitioner } from '../../shared/src/business/entities/Practitioner';
import { ROLE_PERMISSIONS } from '../../shared/src/authorization/authorizationClientService';
import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/cases/CaseConstants';
import { SERVICE_STAMP_OPTIONS } from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { Scan } from '../../shared/src/business/entities/Scan';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '../../shared/src/business/entities/User';

const MINUTES = 60 * 1000;

export const getConstants = () => ({
  ADMISSIONS_STATUS_OPTIONS: Practitioner.ADMISSIONS_STATUS_OPTIONS,
  BUSINESS_TYPES: ContactFactory.BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE: 2,
  CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
  CASE_TYPES: Case.CASE_TYPES,
  CASE_TYPES_MAP: Case.CASE_TYPES_MAP,
  CATEGORIES: Document.CATEGORIES,
  CATEGORY_MAP: Document.CATEGORY_MAP,
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  CHIEF_JUDGE: Case.CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES: Document.CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES: Document.COURT_ISSUED_EVENT_CODES,
  DATE_FORMATS: FORMATS,
  DEFAULT_PROCEDURE_TYPE: CaseInternal.DEFAULT_PROCEDURE_TYPE,
  EMPLOYER_OPTIONS: Practitioner.EMPLOYER_OPTIONS,
  ESTATE_TYPES: ContactFactory.ESTATE_TYPES,
  FILING_TYPES: Case.FILING_TYPES,
  INITIAL_DOCUMENT_TYPES: Document.INITIAL_DOCUMENT_TYPES,
  INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  NOTICE_EVENT_CODES: Document.NOTICE_EVENT_CODES,
  ORDER_TYPES_MAP: Order.ORDER_TYPES,
  OTHER_TYPES: ContactFactory.OTHER_TYPES,
  PARTY_TYPES: ContactFactory.PARTY_TYPES,
  PAYMENT_STATUS: Case.PAYMENT_STATUS,
  PRACTITIONER_TYPE_OPTIONS: Practitioner.PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES: Case.PROCEDURE_TYPES,
  REFRESH_INTERVAL: 20 * MINUTES,
  ROLE_PERMISSIONS,
  SCAN_MODES: Scan.SCAN_MODES,
  SECTIONS,
  SERVICE_INDICATOR_TYPES,
  SERVICE_STAMP_OPTIONS,
  SESSION_DEBOUNCE: 250,
  SESSION_MODAL_TIMEOUT: 5 * MINUTES,
  SESSION_STATUS_GROUPS: TrialSession.SESSION_STATUS_GROUPS,
  SESSION_TIMEOUT:
    (process.env.SESSION_TIMEOUT && parseInt(process.env.SESSION_TIMEOUT)) ||
    55 * MINUTES,
  SIGNED_DOCUMENT_TYPES: Document.SIGNED_DOCUMENT_TYPES,
  STATUS_TYPES: Case.STATUS_TYPES,
  STATUS_TYPES_MANUAL_UPDATE: Case.STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE: Case.STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES: Document.SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE: Document.TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES: TrialSession.TRIAL_CITIES,
  TRIAL_SESSION_TYPES: TrialSession.SESSION_TYPES,
  TRIAL_STATUS_TYPES: TrialSessionWorkingCopy.TRIAL_STATUS_TYPES,
  US_STATES: ContactFactory.US_STATES,
  USER_ROLES: User.ROLES,
});
