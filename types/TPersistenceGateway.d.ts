interface IGetUserById {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TPractitioner>;
}

interface IGetWorkItemById {
  ({
    applicationContext,
    workItemId,
  }: {
    applicationContext: IApplicationContext;
    workItemId: string;
  }): Promise<WorkItem>;
}

interface IPutWorkItemInOutbox {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): Promise<any>;
}

interface ISaveWorkItem {
  ({
    applicationContext,
    workItem,
  }: {
    applicationContext: IApplicationContext;
    workItem: any;
  }): Promise<any>;
}

interface IGetCaseByDocketNumber {
  ({
    applicationContext,
    docketNumber,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
  }): Promise<TCase>;
}

interface IGetDocumentQCInboxForSection {
  ({
    applicationContext,
    judgeUserName,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: any;
    judgeUserName: string;
  }): TSectionWorkItem[];
}
interface ICreateCaseDeadline {
  ({
    applicationContext,
    caseDeadline,
  }: {
    applicationContext: IApplicationContext;
    caseDeadline: TCaseDeadline;
  }): any;
}

interface IGetDocumentQCServedForSection {
  ({
    afterDate,
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    afterDate: string;
    section: TSectionWorkItem;
  }): any;
}

interface IGetConfigurationItemValue {
  ({
    applicationContext,
    configurationItemKey,
  }: {
    applicationContext: IApplicationContext;
    configurationItemKey: string;
  }): string;
}

interface IUpdateDocketEntry {
  ({
    applicationContext,
    docketEntryId,
  }: {
    applicationContext: IApplicationContext;
    docketEntryId: string;
    docketNumber: string;
    document: any;
  }): Promise<any>;
}

interface ICreateMessage {
  ({
    applicationContext,
    message,
  }: {
    applicationContext: IApplicationContext;
    message: TMessageData;
  }): Promise<void>;
}

interface IIsFileExists {
  ({
    applicationContext,
    key,
  }: {
    applicationContext: IApplicationContext;
    key: string;
  }): Promise<boolean>;
}

interface IMarkMessageThreadRepliedTo {
  ({
    applicationContext,
    parentMessageId,
  }: {
    applicationContext: IApplicationContext;
    parentMessageId: string;
  }): Promise<void>;
}

interface IGetMessageThreadByParentId {
  ({
    applicationContext,
    parentMessageId,
  }: {
    applicationContext: IApplicationContext;
    parentMessageId: string;
  }): Promise<TMessageData[]>;
}

interface IUpdateMessage {
  ({
    applicationContext,
    message,
  }: {
    applicationContext: IApplicationContext;
    message: TMessageData;
  }): Promise<void>;
}

interface IGetCompletedSectionInboxMessages {
  ({
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: string;
  }): Promise<TMessageData[]>;
}

interface IGetCompletedUserInboxMessages {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TMessageData[]>;
}

interface IGetSectionInboxMessages {
  ({
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: string;
  }): Promise<TMessageData[]>;
}

interface IGetUserInboxMessages {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TMessageData[]>;
}

interface IGetMessagesByDocketNumber {
  ({
    applicationContext,
    docketNumber,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
  }): Promise<TMessageData[]>;
}

interface IGetSectionOutboxMessages {
  ({
    applicationContext,
    section,
  }: {
    applicationContext: IApplicationContext;
    section: string;
  }): Promise<TMessageData[]>;
}

interface IGetUserOutboxMessages {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TMessageData[]>;
}

interface ISetMessageAsRead {
  ({
    applicationContext,
    docketNumber,
    messageId,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
    messageId: string;
  }): Promise<void>;
}

interface IDeleteUserFromCase {
  ({
    applicationContext,
    docketNumber,
    userId,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
    userId: string;
  }): Promise<void>;
}
interface IGetTrialSessionById {
  ({
    applicationContext,
    trialSessionId,
  }: {
    applicationContext: IApplicationContext;
    trialSessionId: string;
  }): Promise<TTrialSessionData>;
}

interface IDeleteDocumentFromS3 {
  ({
    applicationContext,
    key,
  }: {
    applicationContext: IApplicationContext;
    key: string;
  }): Promise<void>;
}

interface IUpdateCaseCorrespondence {
  ({
    applicationContext,
    correspondence,
    docketNumber,
  }: {
    applicationContext: IApplicationContext;
    correspondence: TCorrespondence;
    docketNumber: string;
  }): Promise<void>;
}

interface IUploadDocumentFromClient {
  ({
    applicationContext,
    document,
    key,
    onUploadProgress,
  }: {
    applicationContext: IApplicationContext;
    document: string;
    key: string;
    onUploadProgress(): any;
  }): Promise<string>;
}

interface IGetCasesByLeadDocketNumber {
  ({
    applicationContext,
    leadDocketNumber,
  }: {
    applicationContext: IApplicationContext;
    leadDocketNumber: string;
  }): Promise<TCase[]>;
}

interface IGetCasesAssociatedWithUser {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TCase[]>;
}

interface IGetCasesForUser {
  ({
    applicationContext,
    userId,
  }: {
    applicationContext: IApplicationContext;
    userId: string;
  }): Promise<TCase[]>;
}

interface IGetCaseDeadlinesByDateRange {
  ({
    applicationContext,
    endDate,
    from,
    judge,
    pageSize,
    startDate,
  }: {
    applicationContext: IApplicationContext;
    endDate: string;
    from: string;
    judge: string;
    pageSize: string;
    startDate: string;
  }): Promise<{
    foundDeadlines: any;
    totalCount: string;
  }>;
}

interface IGetCasesByDocketNumbers {
  ({
    applicationContext,
    docketNumbers,
  }: {
    applicationContext: IApplicationContext;
    docketNumbers: string[];
  }): Promise<TCase[]>;
}

interface IGetBlockedCases {
  ({
    applicationContext,
    trialLocation,
  }: {
    applicationContext: IApplicationContext;
    trialLocation: string;
  }): Promise<TCase[]>;
}

interface IVerifyCaseForUser {
  ({
    applicationContext,
    docketNumber,
    userId,
  }: {
    applicationContext: IApplicationContext;
    docketNumber: string;
    userId: string;
  }): Promise<TUser[]>;
}

interface IGetDownloadPolicyUrl {
  ({
    applicationContext,
    key,
  }: {
    applicationContext: IApplicationContext;
    key: string;
  }): Promise<string>;
}

interface IGetReconciliationReport {
  ({
    applicationContext,
    reconciliationDateEnd,
    reconciliationDateStart,
  }: {
    applicationContext: IApplicationContext;
    reconciliationDateEnd: string;
    reconciliationDateStart: string;
  }): Promise<string>;
}

interface IAdvancedDocumentSearch {
  ({
    applicationContext,
    documentEventCodes,
    isOpinionSearch,
  }: {
    applicationContext: IApplicationContext;
    documentEventCodes: any;
    isOpinionSearch: boolean;
  }): Promise<{
    results: any;
    totalCount: string;
  }>;
}

type TPersistenceGateway = {
  [key: string]: any;
  getReconciliationReport: IGetReconciliationReport;
  advancedDocumentSearch: IAdvancedDocumentSearch;
  isFileExists: IIsFileExists;
  verifyCaseForUser: IVerifyCaseForUser;
  getDownloadPolicyUrl: IGetDownloadPolicyUrl;
  createCaseDeadline: ICreateCaseDeadline;
  getCaseByDocketNumber: IGetCaseByDocketNumber;
  getWorkItemById: IGetWorkItemById;
  putWorkItemInOutbox: IPutWorkItemInOutbox;
  getDocumentQCInboxForSection: IGetDocumentQCInboxForSection;
  saveWorkItem: ISaveWorkItem;
  getDocumentQCServedForSection: IGetDocumentQCServedForSection;
  getConfigurationItemValue: IGetConfigurationItemValue;
  updateDocketEntry: IUpdateDocketEntry;
  createMessage: ICreateMessage;
  markMessageThreadRepliedTo: IMarkMessageThreadRepliedTo;
  getMessageThreadByParentId: IGetMessageThreadByParentId;
  updateMessage: IUpdateMessage;
  getCompletedSectionInboxMessages: IGetCompletedSectionInboxMessages;
  getCompletedUserInboxMessages: IGetCompletedUserInboxMessages;
  getSectionInboxMessages: IGetSectionInboxMessages;
  getUserInboxMessages: IGetUserInboxMessages;
  getMessagesByDocketNumber: IGetMessagesByDocketNumber;
  getSectionOutboxMessages: IGetSectionOutboxMessages;
  getUserOutboxMessages: IGetUserOutboxMessages;
  setMessageAsRead: ISetMessageAsRead;
  deleteUserFromCase: IDeleteUserFromCase;
  getTrialSessionById: IGetTrialSessionById;
  deleteDocumentFromS3: IDeleteDocumentFromS3;
  updateCaseCorrespondence: IUpdateCaseCorrespondence;
  uploadDocumentFromClient: IUploadDocumentFromClient;
  getCasesByLeadDocketNumber: IGetCasesByLeadDocketNumber;
  getUserById: IGetUserById;
  getCasesAssociatedWithUser: IGetCasesAssociatedWithUser;
  getCasesForUser: IGetCasesForUser;
  getCaseDeadlinesByDateRange: IGetCaseDeadlinesByDateRange;
  getCasesByDocketNumbers: IGetCasesByDocketNumbers;
  getBlockedCases: IGetBlockedCases;
};
