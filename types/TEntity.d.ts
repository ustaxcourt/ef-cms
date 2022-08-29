type TCaseDeadline = {
  associatedJudge: string;
  caseDeadlineId: number;
  createdAt: Date;
  deadlineDate: Date;
  description: string;
  docketNumber: string;
  sortableDocketNumber: string;
};

type DocketEntry = {
  additionalInfo: string;
  descriptionDisplay: string;
  docketEntryId: string;
  documentTitle: string;
  documentType: string;
  eventCode: string;
  filedBy: string;
  index: string;
  isFileAttached: string;
  isPaper: string;
  otherFilingParty: string;
  receivedAt: string;
  sentBy: string;
  servedAt: string;
  userId: string;
};

type WorkItem = {
  createdAt: string;
  assigneeId: string;
  docketEntry: DocketEntry;
  docketNumber: string;
};

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
  isClosed: boolean;
  startDate: string;
  startTime: string;
  state: string;
  swingSession: string;
  swingSessionId: string;
  term: string;
  termYear: string;
  trialLocation: string;
  proceedingType: string;
  trialSessionId: string;
  judge: {
    name: string;
  };
  trialClerk: string;
};

type TTrialSessionWorkingCopyData = {
  caseMetadata: any;
  filters: {
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
  sessionNotes: string;
  sort: string;
  sortOrder: string;
  trialSessionId: string;
  userId: string;
};

type TCase = {
  associatedJudge: string;
  automaticBlocked: string;
  automaticBlockedDate: string;
  automaticBlockedReason: string;
  blocked: string;
  blockedDate: string;
  blockedReason: string;
  canAllowDocumentService: string;
  canAllowPrintableDocketRecord: string;
  caseCaption: string;
  caseNote: string;
  caseType: string;
  closedDate: string;
  hearings: {
    trialSessionId: string;
  }[];
  createdAt: string;
  damages: string;
  docketNumber: string;
  docketNumberSuffix: string;
  docketNumberWithSuffix: string;
  filingType: string;
  hasPendingItems: boolean;
  hasVerifiedIrsNotice: string;
  highPriority: string;
  highPriorityReason: string;
  initialCaption: string;
  initialDocketNumberSuffix: string;
  irsNoticeDate: string;
  isPaper: string;
  judgeUserId: string;
  leadDocketNumber: string;
  litigationCosts: string;
  mailingDate: string;
  noticeOfAttachments: string;
  noticeOfTrialDate: string;
  orderDesignatingPlaceOfTrial: boolean;
  orderForAmendedPetition: boolean;
  orderForAmendedPetitionAndFilingFee: boolean;
  orderForFilingFee: boolean;
  orderForOds: boolean;
  orderForRatification: boolean;
  orderToShowCause: boolean;
  partyType: string;
  petitionPaymentDate: string;
  petitionPaymentMethod: string;
  petitionPaymentStatus: string;
  petitionPaymentWaivedDate: string;
  preferredTrialCity: string;
  procedureType: string;
  qcCompleteForTrial: string;
  receivedAt: string;
  sealedDate: string;
  sortableDocketNumber: string;
  status: string;
  trialDate: string;
  trialLocation: string;
  trialSessionId: string;
  trialTime: string;
  useSameAsPrimary: string;
  petitioners: TPetitioner[];
  isUserIdRepresentedByPrivatePractitioner: any;
};

type TPetitioner = {
  contactId: string;
  serviceIndicator: string;
  updatedEmail: string;
  confirmEmail: string;
  contactType: string;
};

type TPractitioner = {
  additionalPhone: string;
  admissionsDate: string;
  admissionsStatus: string;
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
