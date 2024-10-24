import { PUBLIC_DOCKET_RECORD_FILTER_OPTIONS } from '../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
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
import { publicTrialSessionsHelper } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
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
  publicTrialSessionsHelper: publicTrialSessionsHelper as unknown as ReturnType<
    typeof publicTrialSessionsHelper
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
  judges: [] as RawUser[],
  modal: {},
  progressIndicator: {
    // used for the spinner that shows when waiting for network responses
    waitingForResponse: false,
    waitingForResponseRequests: 0,
  },
  publicTrialSessionData: {} as { [key: string]: any },
  sessionMetadata: {
    docketRecordFilter: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    docketRecordSort: {},
    todaysOrdersSort: '',
  },
  showPassword: false,
  todaysOpinions: [],
  todaysOrders: {
    results: [],
    totalCount: 0,
  },
  trialSessionsPage: { trialSessions: [] } as {
    trialSessions: TrialSessionInfoDTO[];
  },
  user: {},
  validationErrors: {},
};

export const initialPublicState = {
  ...baseState,
  ...computeds,
};

export type PublicClientState = typeof initialPublicState;
