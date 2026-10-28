import { PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS } from '@shared/business/entities/EntityConstants';

export const MOTION_FOR_CONTINUANCE_EVENT_CODE = 'M006';
export const MOTION_FOR_NEW_TRIAL_DOCUMENT_TYPE = 'Motion for a New Trial';
export const MOTION_FOR_NEW_TRIAL_EVENT_CODE = 'M218';
export const MOTION_FOR_LEAVE_EVENT_CODE = 'M115';
export const BRIEF_IN_SUPPORT_EVENT_CODE =
  PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS[0];
export const MEMORANDA_IN_SUPPORT_EVENT_CODE =
  PUBLIC_SUPPORTING_EVENT_CODES_FOR_MOTIONS[1];
export const BRIEF_IN_SUPPORT_DOCUMENT_TYPE = 'Brief in Support';
export const MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE = 'Memorandum in Support';
export const DEFAULT_MOTION_DOCUMENT_TYPE = 'Motion for Continuance';
export const DEFAULT_SUPPORTING_DOCUMENT_TYPES = [
  BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
  MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
];
export const PETITIONER_FIVE_SUPPORTING_DOCUMENT_TYPES = [
  BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
  BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
  BRIEF_IN_SUPPORT_DOCUMENT_TYPE,
  MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
  MEMORANDUM_IN_SUPPORT_DOCUMENT_TYPE,
];
export const UNAUTHORIZED_PETITIONER_EMAIL = 'petitioner2@example.com';

export {
  MOTION_VISIBILITY_POLICY_CHANGE_DATE_FLAG,
  restoreMotionVisibilityPolicyFlag,
  setMotionVisibilityPolicyDateToToday,
  setMotionVisibilityPolicyDateToTomorrow,
  setMotionVisibilityPolicyDateToYesterday,
  setOriginalMotionVisibilityPolicyFlag,
  toggleMotionVisibilityPolicyFlag,
} from './motion-visibility-policy-flag-helpers';
