export const presenter = {
  providers: {},
  state: {
    advancedSearchForm: {}, // form for advanced search screen, TODO: replace with state.form
    archiveDraftDocument: {
      // used by the delete draft document modal
      caseId: null,
      documentId: null,
      documentTitle: null,
    },
    assigneeId: null, // used for assigning workItems in assignSelectedWorkItemsAction
    batchDownloads: {}, // batch download of PDFs
    caseDetail: {},
    cases: [],
    cognitoLoginUrl: null,
    completeForm: {}, // TODO: replace with state.form
    currentPage: 'Interstitial',
    currentViewMetadata: {
      caseDetail: {},
      documentDetail: {
        tab: '',
      },
      documentSelectedForScan: null,
      documentUploadMode: 'scan',
      messageId: '',
      startCaseInternal: {
        tab: '',
      },
      tab: '',
      trialSessions: {
        tab: null,
      },
    },
    docketRecordIndex: 0, // needs its own object because it's present when other forms are on screen
    documentId: null,
    fieldOrder: [], // TODO: related to errors
    fileUploadProgress: {
      // used for the progress bar shown in modal when uploading files
      isUploading: false,
      percentComplete: 0,
      timeRemaining: Number.POSITIVE_INFINITY,
    },
    form: {}, // shared object for creating new entities, clear before using
    header: {
      searchTerm: '',
      showBetaBar: true,
      showMobileMenu: false,
      showUsaBannerDetails: false,
    },
    modal: {
      pdfPreviewModal: undefined,
      showModal: undefined, // the name of the modal to display
    },
    navigation: {},
    notifications: {},
    pdfForSigning: {
      documentId: null,
      nameForSigning: '',
      pageNumber: 1,
      pdfjsObj: null,
      signatureApplied: false,
      signatureData: null,
    },
    permissions: null,
    previewPdfFile: null,
    progressIndicator: {
      // used for the spinner that shows when waiting for network responses
      waitingForResponse: false,
      waitingForResponseRequests: 0,
    },
    scanner: {
      batchIndexToDelete: null,
      batchIndexToRescan: null, // batch index for re-scanning
      batchToDeletePageCount: null,
      batches: [],
      currentPageIndex: 0, // batches from scanning
      isScanning: false,
      selectedBatchIndex: 0,
    },
    screenMetadata: {},
    sectionInboxCount: 0,
    sectionUsers: [],
    selectedWorkItems: [],
    sessionMetadata: {
      docketRecordSort: [],
    },
    showValidation: false,
    user: null,
    users: [],
    validationErrors: {},
    workItem: {},
    workItemActions: {},
    workItemMetadata: {},
    workQueue: [],
    workQueueToDisplay: {
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: true,
    },
  },
};
