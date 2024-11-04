import { PUBLIC_DOCKET_RECORD_FILTER_OPTIONS } from '../../../shared/src/business/entities/EntityConstants';
import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { advancedDocumentSearchHelper } from './computeds/AdvancedSearch/advancedDocumentSearchHelper';
import { advancedSearchHelper } from './computeds/AdvancedSearch/advancedSearchHelper';
import { caseSearchByNameHelper } from './computeds/AdvancedSearch/CaseSearchByNameHelper';
import { headerPublicHelper } from '@web-client/presenter/computeds/headerPublicHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { practitionerSearchFormHelper } from '@web-client/presenter/computeds/practitionerSearchFormHelper';
import { practitionerSearchHelper } from '@web-client/presenter/computeds/AdvancedSearch/practitionerSearchHelper';
import { publicAlertHelper } from './computeds/Public/publicAlertHelper';
import { publicCaseDetailHeaderHelper } from './computeds/Public/publicCaseDetailHeaderHelper';
import { publicCaseDetailHelper } from './computeds/Public/publicCaseDetailHelper';
import { publicTrialSessionDetailsHelper } from '@web-client/presenter/computeds/Public/publicTrialSessionDetailsHelper';
import { templateHelper } from './computeds/templateHelper';
import { todaysOpinionsHelper } from './computeds/Public/todaysOpinionsHelper';
import { todaysOrdersHelper } from './computeds/Public/todaysOrdersHelper';

const computeds = {
  advancedDocumentSearchHelper,
  advancedSearchHelper,
  alertHelper: publicAlertHelper,
  caseSearchByNameHelper,
  headerPublicHelper,
  loadingHelper,
  menuHelper,
  practitionerSearchFormHelper,
  practitionerSearchHelper: practitionerSearchHelper as unknown as ReturnType<
    typeof practitionerSearchHelper
  >,
  publicCaseDetailHeaderHelper,
  publicCaseDetailHelper: publicCaseDetailHelper as unknown as ReturnType<
    typeof publicCaseDetailHelper
  >,
  publicTrialSessionDetailsHelper:
    publicTrialSessionDetailsHelper as unknown as ReturnType<
      typeof publicTrialSessionDetailsHelper
    >,
  templateHelper,
  todaysOpinionsHelper,
  todaysOrdersHelper,
};

export const baseState = {
  advancedSearchForm: {},
  advancedSearchTab: 'case',
  alertError: null,
  alertSuccess: null,
  caseDetail: {} as RawPublicCase,
  cognitoResendVerificationLinkUrl: '',
  commonUI: {
    showBetaBar: true,
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  currentPage: 'Interstitial',
  featureFlags: undefined as unknown as { [key: string]: string },
  form: {} as Record<string, any>,
  header: {
    searchTerm: '',
    showBetaBar: true, // default state
    showMobileMenu: false,
    showUsaBannerDetails: false,
  },
  isPublic: true,
  isTerminalUser: false,
  modal: {},
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
  },
  sessionMetadata: {
    docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    docketRecordSort: {},
    todaysOrdersSort: '',
  },
  showPassword: false,
  todaysOpinions: [],
  todaysOrders: {
    page: 1,
    results: [],
    totalCount: 0,
  },
  trialSessionDetailsPage: {
    trialSession: {} as PublicTrialSessionDetails,
  },
  user: {},
  validationErrors: {},
};

export const initialPublicState = {
  ...baseState,
  ...computeds,
};

export type PublicClientState = typeof initialPublicState;
