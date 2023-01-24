/* eslint-disable no-unused-vars */
type TCaseDeadline = {
  associatedJudge: string;
  caseDeadlineId: number;
  createdAt: Date;
  deadlineDate: Date;
  description: string;
  docketNumber: string;
  sortableDocketNumber: string;
};

type TPractitionerDocument = {
  categoryType: string;
  categoryName: string;
  location: string;
  practitionerDocumentFileId: string;
};

type TPractitionerDocumentEntity = {
  validate(): TPractitionerDocumentEntity;
  toRawObject(): TPractitionerDocument;
} & TPractitionerDocument;

// TODO: rename to TDocketEntry
type DocketEntry = {
  additionalInfo?: string;
  addToCoversheet: boolean;
  caseCaption?: string;
  certificateOfService?: string;
  createdAt: string;
  descriptionDisplay?: string;
  docketEntryId: string;
  docketNumber: string;
  documentContentsId?: string;
  documentTitle: string;
  documentType: string;
  draftOrderState?: object;
  editState?: object;
  entityName: string;
  eventCode: string;
  filedBy?: string;
  filers: string[];
  filingDate: string;
  index?: number;
  isDraft: boolean;
  isFileAttached?: boolean;
  isLegacyServed?: boolean;
  isMinuteEntry: boolean;
  isOnDocketRecord: boolean;
  isPaper?: boolean;
  isPendingService: boolean;
  isStricken: boolean;
  lodged?: boolean;
  mailingDate?: string;
  numberOfPages?: number;
  otherFilingParty?: string;
  pending: boolean;
  pk: string;
  privatePractitioners?: object[];
  processingStatus: string;
  receivedAt: string;
  sentBy?: string;
  servedAt?: string;
  servedParties?: object[];
  servedPartiesCode?: string;
  sk: string;
  stampData: object;
  userId: string;
  workItem: WorkItem;
};

type TDocketEntryEntity = {
  setAsProcessingStatusAsCompleted: () => void;
  setNumberOfPages: (numberOfPages: number) => void;

  validate(): TDocketEntryEntity;
  toRawObject(): DocketEntry;

  workItem: TWorkItemEntity;
} & DocketEntry;

type TWorkItemEntity = {
  assignToUser: ({
    assigneeId,
    assigneeName,
    section,
    sentBy,
    sentBySection,
    sentByUserId,
  }: {
    assigneeId: string;
    assigneeName: string;
    section: string;
    sentBy: string;
    sentBySection: string;
    sentByUserId: string;
  }) => TWorkItemEntity;
  toRawObject(): WorkItem;
  validate(): TWorkItemEntity;
} & WorkItem;

type WorkItem = {
  createdAt: string;
  assigneeId: string;
  assigneeName: string;
  associatedJudge: string;
  caseIsInProgress: boolean;
  caseStatus: string;
  caseTitle: string;
  completedBy: string;
  completedByUserId: string;
  completedMessage: string;
  docketNumberWithSuffix: string;
  entityName: string;
  highPriority: boolean;
  isInitializeCase: boolean;
  docketEntry: DocketEntry;
  docketNumber: string;
  workItemId: string;
  completedAt: string;
  updatedAt: string;
  gsi1pk: string;
  inProgress: boolean;
};

type TOutboxItem = {
  caseStatus: string;
  caseTitle: string;
  completedAt: string;
  completedBy: string;
  caseIsInProgress: boolean;
  docketEntry: DocketEntry;
  docketNumber: string;
  highPriority: boolean;
  inProgress: boolean;
  leadDocketNumber: string;
  section: string;
  trialDate: string;
  workItemId: string;
} & WorkItem;

type TOutboxItemEntity = {
  validate(): TOutboxItemEntity;
  isValid(): boolean;
  toRawObject(): TOutboxItem;
} & TOutboxItem;

type TDynamoRecord = {
  pk: string;
  sk: string;
  gsi1pk?: string;
  ttl?: number;
  [key: string]: any;
};

type OutboxDynamoRecord = TOutboxItem & TDynamoRecord;

type TSectionWorkItem = {
  createdAt: string;
  docketEntry: DocketEntry[];
  docketNumber: string;
  docketNumberSuffix: string;
  messages: any;
  section: string;
  sentBy: string;
};

type TMessageData = {
  attachments: {
    documentId: string;
  }[];
  caseStatus: string;
  caseTitle: string;
  completedAt: string;
  completedBy: string;
  completedBySection: string;
  completedByUserId: string;
  completedMessage: string;
  createdAt: string;
  leadDocketNumber: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  from: string;
  fromSection: string;
  fromUserId: string;
  isCompleted: boolean;
  isRead: boolean;
  isRepliedTo: string;
  message: string;
  messageId: string;
  parentMessageId: string;
  subject: string;
  to: string;
  toSection: string;
  toUserId: string;
};

type TMessageEntity = {
  markAsCompleted: ({
    message,
    user,
  }: {
    message: string;
    user: {
      name: string;
      userId: string;
      section: string;
    };
  }) => void;
  validate: () => {
    toRawObject: () => TMessageData;
  };
} & TMessageData;

type TUserContact = {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  country: string;
  countryType: string;
  phone: string;
  postalCode: string;
  state: string;
};

type TUser = {
  email: string;
  name: string;
  pendingEmail?: string;
  section: string;
  role: string;
  token: string;
  userId: string;
  isUpdatingInformation: boolean;
  pendingEmailVerificationToken?: string;
  judgeFullName?: string;
  judgeTitle?: string;
  contact?: TUserContact;
};

type TTrialSessionData = {
  address1: string;
  address2: string;
  caseOrder: any;
  chambersPhoneNumber: string;
  city: string;
  courtReporter: string;
  courthouseName: string;
  createdAt: string;
  sessionStatus: string;
  estimatedEndDate: string;
  irsCalendarAdministrator: string;
  isCalendared: boolean;
  joinPhoneNumber: string;
  maxCases: number;
  meetingId: string;
  notes: string;
  noticeIssuedDate: string;
  password: string;
  postalCode: string;
  sessionScope: string;
  sessionType: string;
  startDate: string;
  startTime: string;
  state: string;
  swingSession: boolean;
  swingSessionId: string;
  term: string;
  termYear: string;
  trialLocation: string;
  proceedingType: string;
  trialSessionId: string;
  judge: {
    name: string;
    userId: string;
  };
  trialClerk: string;
};

type TTrialSessionWorkingCopyData = {
  caseMetadata: any;
  filters: {
    basisReached: boolean;
    continued: boolean;
    definiteTrial: boolean;
    dismissed: boolean;
    motionToDismiss: boolean;
    probableSettlement: boolean;
    probableTrial: boolean;
    recall: boolean;
    rule122: boolean;
    setForTrial: boolean;
    settled: boolean;
    showAll: boolean;
    statusUnassigned: boolean;
    submittedCAV: boolean;
  };
  sessionNotes: string;
  sort: string;
  sortOrder: string;
  trialSessionId: string;
  userId: string;
};

type TCaseEntity = {
  getDocketEntryById: ({
    docketEntryId,
  }: {
    docketEntryId: string;
  }) => TDocketEntryEntity;
  addDocketEntry: (docketEntry: TDocketEntryEntity) => void;
  updateDocketEntry: (docketEntry: TDocketEntryEntity) => void;
  isUserIdRepresentedByPrivatePractitioner: (id: string) => boolean;
} & TCase;

type TCase = {
  associatedJudge: string;
  automaticBlocked?: string;
  automaticBlockedDate?: string;
  automaticBlockedReason?: string;
  statistics: any[];
  blocked?: boolean;
  isSealed: boolean;
  blockedDate?: string;
  blockedReason?: string;
  docketEntries?: DocketEntry[];
  canAllowDocumentService?: boolean;
  caseTitle?: string;
  canAllowPrintableDocketRecord?: boolean;
  caseCaption: string;
  caseNote?: string;
  caseType: string;
  closedDate?: string;
  hearings?: {
    trialSessionId: string;
  }[];
  createdAt: string;
  damages?: string;
  docketNumber: string;
  docketNumberSuffix: string;
  docketNumberWithSuffix: string;
  entityName: string;
  filingType?: string;
  hasPendingItems: boolean;
  hasVerifiedIrsNotice: boolean;
  highPriority?: boolean;
  highPriorityReason?: string;
  initialCaption: string;
  initialDocketNumberSuffix: string;
  irsNoticeDate?: string;
  isPaper: boolean;
  judgeUserId?: string;
  leadDocketNumber: string;
  litigationCosts?: string;
  mailingDate?: string;
  noticeOfAttachments: boolean;
  noticeOfTrialDate?: string;
  orderDesignatingPlaceOfTrial: boolean;
  orderForAmendedPetition: boolean;
  orderForAmendedPetitionAndFilingFee: boolean;
  orderForFilingFee: boolean;
  orderForOds: boolean;
  orderForRatification: boolean;
  orderToShowCause: boolean;
  partyType: string;
  petitionPaymentDate?: string | null;
  petitionPaymentMethod?: string;
  petitionPaymentStatus: string;
  petitionPaymentWaivedDate: string | null;
  preferredTrialCity: string;
  procedureType: string;
  qcCompleteForTrial: object;
  receivedAt: string;
  sealedDate?: string;
  sortableDocketNumber: number;
  status: string;
  trialDate?: string;
  trialLocation?: string;
  trialSessionId?: string;
  trialTime?: string;
  useSameAsPrimary?: boolean;
  petitioners: TPetitioner[];
};

type TPetitioner = {
  updatedEmail?: string;
  email?: string;
  confirmEmail?: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  contactId: string;
  contactType: string;
  countryType: string;
  entityName: string;
  isAddressSealed: boolean;
  name: string;
  phone: string;
  postalCode: string;
  sealedAndUnavailable: boolean;
  serviceIndicator: string;
  state: string;
};

type TCaseNote = {
  userId: string;
  docketNumber: string;
  notes: string;
};

type TPractitioner = {
  entityName: string;
  additionalPhone: string;
  admissionsDate: string;
  admissionsStatus: string;
  representing: string[];
  barNumber: string;
  birthYear: string;
  confirmEmail: string;
  employer: string;
  firmName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  name: string;
  originalBarState: string;
  practitionerNotes: string;
  practitionerType: string;
  section: string;
  suffix: string;
  serviceIndicator: string;
  updatedEmail: string;
  role: string;
} & TUser;

interface IValidateRawCollection<I> {
  (collection: I[], options: { applicationContext: IApplicationContext }): I[];
}

type TTrialSessionEntity = {
  isCaseAlreadyCalendared(caseEntity: TCase): boolean;
  deleteCaseFromCalendar({
    docketNumber,
  }: {
    docketNumber: string;
  }): TTrialSessionEntity;
  manuallyAddCaseToCalendar({
    calendarNotes,
    caseEntity,
  }: {
    calendarNotes: string;
    caseEntity: TCase;
  });
  validate(): TTrialSessionEntity;
  toRawObject(): TTrialSessionData;
} & TTrialSessionData;

type TCorrespondence = {
  correspondenceId: string;
};

type TDocumentMetaData = {
  docketNumber: string;
  documentTitle: string;
  filingDate: string;
  correspondenceId: string;
};

type TContact = {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  confirmEmail: string;
  contactId: string;
  contactType: string;
  countryType: string;
  phone: string;
  postalCode: string;
  serviceIndicator: string;
  state: string;
  updatedEmail: string;
  email: string;
  title: string;
  name: string;
  contactPrimary: {
    name: string;
  };
  contactSecondary: {
    name: string;
  };
};

type TError = TContact;

type TPrintableTableFilters = {
  aBasisReached: boolean;
  continued: boolean;
  dismissed: boolean;
  recall: boolean;
  rule122: boolean;
  setForTrial: boolean;
  settled: boolean;
  showAll: boolean;
  statusUnassigned: boolean;
  takenUnderAdvisement: boolean;
};
