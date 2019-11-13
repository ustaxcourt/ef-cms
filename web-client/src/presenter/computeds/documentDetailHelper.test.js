import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { documentDetailHelper as documentDetailHelperComputed } from './documentDetailHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const getDateISO = () => new Date().toISOString();

let globalUser;

const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
  {
    ...applicationContext,
    getConstants: () => ({
      ORDER_TYPES_MAP: [
        {
          documentTitle: 'Order of Dismissal',
          documentType: 'Order of Dismissal',
          eventCode: 'OD',
        },
      ],
      STATUS_TYPES: Case.STATUS_TYPES,
      USER_ROLES: User.ROLES,
    }),
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

const getBaseState = user => {
  globalUser = user;
  return {
    constants: { STATUS_TYPES: Case.STATUS_TYPES, USER_ROLES: User.ROLES },
    permissions: getUserPermissions(user),
  };
};

describe('document detail helper', () => {
  it('formats the workitems', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [],
          status: Case.STATUS_TYPES.generalDocket,
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showAction('complete', 'abc')).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean false when case status is general docket', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [],
          status: Case.STATUS_TYPES.generalDocket,
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(false);
  });

  it('sets the showCaseDetailsEdit boolean true when case status new', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [],
          status: Case.STATUS_TYPES.new,
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });

  it('sets the showCaseDetailsEdit boolean true when case status recalled', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [],
          status: Case.STATUS_TYPES.recalled,
        },
        documentId: 'abc',
        workItemActions: {
          abc: 'complete',
        },
      },
    });
    expect(result.showCaseDetailsEdit).toEqual(true);
  });

  it('should set showSignDocumentButton to true when user has COURT_ISSUED_DOCUMENT permission and there is a valid document to sign that is not already signed', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Proposed Stipulated Decision',
              workItems: [
                {
                  assigneeId: user.userId,
                  caseStatus: Case.STATUS_TYPES.new,
                  document: {
                    documentId: 'abc',
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
          status: Case.STATUS_TYPES.new,
        },
        documentId: 'abc',
      },
    });
    expect(result.showSignDocumentButton).toEqual(true);
  });

  describe('createdFiledLabel', () => {
    it('should set createFiledLabel to `Created` for a court-issued document', async () => {
      const user = {
        role: User.ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.createdFiledLabel).toEqual('Created');
    });

    it('should set createFiledLabel to `Filed` for a non court-issued document', async () => {
      const user = {
        role: User.ROLES.docketClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.createdFiledLabel).toEqual('Filed');
    });
  });

  describe('showAddDocketEntryButton', () => {
    it('should set showAddDocketEntryButton true when the user has the DOCKET_ENTRY permission and the document is an unsigned stipulated decision', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('should set showAddDocketEntryButton false when the user has the DOCKET_ENTRY permission and the document is a signed stipulated decision', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                signedAt: getDateISO(),
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('should set showAddDocketEntryButton true when the user has the DOCKET_ENTRY permission and the document is an unsigned order', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('should set showAddDocketEntryButton false when the user has the DOCKET_ENTRY permission and the document is a served order', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
                servedAt: getDateISO(),
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('should set showAddDocketEntryButton false when the user does not have the DOCKET_ENTRY permission', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: false },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('should set showAddDocketEntryButton false when the document type is not an order or stipulated decision', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showAddDocketEntryButton).toEqual(false);
    });
  });

  describe('showServeToIrsButton and showRecallButton', () => {
    it('should set showServeToIrsButton true and showRecallButton false when case status is new', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showServeToIrsButton).toEqual(true);
      expect(result.showRecallButton).toEqual(false);
    });

    it('should set showServeToIrsButton true and showRecallButton false when case status is recalled', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.recalled,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showServeToIrsButton).toEqual(true);
      expect(result.showRecallButton).toEqual(false);
    });

    it('should set showServeToIrsButton false and showRecallButton true when case status is Batched for IRS', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.batchedForIRS,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showServeToIrsButton).toEqual(false);
      expect(result.showRecallButton).toEqual(true);
    });

    it('should set showServeToIrsButton false and showRecallButton false when case status is general docket', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.generalDocket,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showServeToIrsButton).toEqual(false);
      expect(result.showRecallButton).toEqual(false);
    });

    it('should set showServeToIrsButton false and showRecallButton false if document type is not a petition', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Answer',
              },
            ],
            status: Case.STATUS_TYPES.batchedForIRS,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showServeToIrsButton).toEqual(false);
      expect(result.showRecallButton).toEqual(false);
    });

    it('should not show the showServeToIrsButton or the showRecallButton for a docketclerk', () => {
      const user = {
        role: User.ROLES.docketClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showServeToIrsButton).toEqual(false);
      expect(result.showRecallButton).toEqual(false);
    });
  });

  describe('showDocumentInfoTab', () => {
    it('should be false if document is not a petition', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'NotAPetition',
              },
            ],
            status: Case.STATUS_TYPES.recalled,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });

    it('should be true if document is a petition and status is New, Recalled, or Batched for IRS', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.recalled,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(true);
    });

    it('should be false if document is a petition and status is not New, Recalled, or Batched for IRS', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.generalDocket,
          },
          documentId: 'abc',
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showDocumentInfoTab).toEqual(false);
    });

    it('should show the serve button when a docketclerk and the document is a Stipulated Decision and the document is not served already', () => {
      const user = {
        role: User.ROLES.docketClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'new',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(true);
    });

    it('should NOT show the serve button when user does not have serve document permission', () => {
      const user = {
        role: User.ROLES.admissionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(false);
    });

    it('should NOT show the serve button when the document is NOT a signed stipulated decision', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Proposed Stipulated Decision',
              },
            ],
          },
          documentId: 'abc',
        },
      });
      expect(result.showServeDocumentButton).toEqual(false);
    });
  });

  describe('showEditDocketEntry', () => {
    it('should set showEditDocketEntry true when the the document is a signed stipulated decision and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                signedAt: getDateISO(),
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(true);
    });

    it('should set showEditDocketEntry false when the the document is an unsigned stipulated decision and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });

    it('should set showEditDocketEntry true when the the document is a served order and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
                servedAt: getDateISO(),
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(true);
    });

    it('should set showEditDocketEntry false when the the document is an unserved order and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Order of Dismissal',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });

    it('should set showEditDocketEntry false when the the document is petition and the user has the DOCKET_ENTRY permission', async () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };

      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
              },
            ],
            status: Case.STATUS_TYPES.new,
          },
          documentId: 'abc',
          permissions: { DOCKET_ENTRY: true },
          workItemActions: {
            abc: 'complete',
          },
        },
      });
      expect(result.showEditDocketEntry).toEqual(false);
    });
  });

  it('should NOT show the serve button when a docketclerk and the document is a Stipulated Decision and document has already been served', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Stipulated Decision',
              status: 'served',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showServeDocumentButton).toEqual(false);
  });

  it('should indicate QC completed by workItem "completedBy" if not indicated on Document', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'petitioner',
              workItems: [
                {
                  caseStatus: Case.STATUS_TYPES.new,
                  completedAt: '2018-11-21T20:49:28.192Z',
                  completedBy: 'William T. Riker',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: Case.STATUS_TYPES.new,
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.qcInfo).toMatchObject({
      date: '11/21/18',
      name: 'William T. Riker',
    });
  });

  it('should indicate QC completed by "qcByUser" on Document if present', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              qcAt: '2019-10-27T20:49:28.192Z',
              qcByUser: {
                name: 'Reginald Barclay',
                userId: 'xyzzy',
              },
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'petitioner',
              workItems: [
                {
                  caseStatus: Case.STATUS_TYPES.new,
                  completedAt: '2018-11-21T20:49:28.192Z',
                  completedBy: 'William T. Riker',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: Case.STATUS_TYPES.new,
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.qcInfo).toMatchObject({
      date: '10/27/19',
      name: 'Reginald Barclay',
    });
  });

  it('should filter out completed work items with Served on IRS messages', () => {
    const user = {
      role: User.ROLES.adc,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              reviewDate: '2018-11-21T20:49:28.192Z',
              userId: 'petitioner',
              workItems: [
                {
                  caseStatus: Case.STATUS_TYPES.new,
                  completedAt: '2018-11-21T20:49:28.192Z',
                  document: {
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
                {
                  assigneeId: 'abc',
                  caseStatus: Case.STATUS_TYPES.new,
                  document: {
                    documentType: 'Proposed Stipulated Decision',
                    receivedAt: '2018-11-21T20:49:28.192Z',
                  },
                  messages: [
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',

                      message: 'Served on IRS',
                    },
                    {
                      createdAt: '2018-11-21T20:49:28.192Z',
                      message: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        workQueueToDisplay: { workQueueIsInternal: true },
      },
    });

    expect(result.formattedDocument.workItems).toHaveLength(1);
  });

  it('default to empty array when caseDetail.documents is undefined', () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: undefined,
        },
      },
    });

    expect(result.formattedDocument).toMatchObject({});
  });

  it("default to empty array when a document's workItems are non-existent", () => {
    const user = {
      role: User.ROLES.petitionsClerk,
      userId: '123',
    };
    const result = runCompute(documentDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            {
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: undefined,
            },
          ],
        },
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      },
    });

    expect(result.formattedDocument.documentId).toEqual(
      'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  describe('showViewOrdersNeededButton', () => {
    it("should show the 'view orders needed' link if a document has been served and user is petitionsclerk", () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: User.ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(true);
    });

    it("should NOT show the 'view orders needed' link if a document has been served and user is NOT a petitionsclerk", () => {
      const user = {
        role: User.ROLES.docketClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: User.ROLES.docketClerk,
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(false);
    });

    it("should NOT show the 'view orders needed' link if a document has NOT been served and user is a petitionsclerk", () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'processing',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: User.ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(false);
    });

    it("should NOT show the 'view orders needed' link if a document has NOT been served and user is NOT a petitionsclerk", () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'processing',
              },
            ],
          },
          documentId: 'abc',
          user: {
            role: User.ROLES.docketClerk,
          },
        },
      });

      expect(result.showViewOrdersNeededButton).toEqual(false);
    });
  });

  describe('showConfirmEditOrder and showRemoveSignature', () => {
    it('should show confirm edit order and remove signature', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Order of Dismissal',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: User.ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(true);
      expect(result.showRemoveSignature).toEqual(true);
    });

    it('should NOT show confirm edit order OR remove signature when the documentType is not an order', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Petition',
                signedAt: getDateISO(),
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: User.ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(false);
      expect(result.showRemoveSignature).toEqual(false);
    });

    it('should NOT show confirm edit order OR remove signature when the document has not been signed', () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: '123-abc',
                documentType: 'Petition',
                signedAt: null,
              },
            ],
          },
          documentId: '123-abc',
          user: {
            role: User.ROLES.petitionsClerk,
          },
        },
      });

      expect(result.showConfirmEditOrder).toEqual(false);
      expect(result.showRemoveSignature).toEqual(false);
    });
  });

  describe('showPrintCaseConfirmationButton', () => {
    it("should show the 'print confirmation' button if a document has been served and the document is a petition ", () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.showPrintCaseConfirmationButton).toEqual(true);
    });

    it("should not show the 'print confirmation' button if a document has not been served", () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Petition',
                status: 'new',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.showPrintCaseConfirmationButton).toEqual(false);
    });

    it("should not show the 'print confirmation' button if the document is not a petition ", () => {
      const user = {
        role: User.ROLES.petitionsClerk,
        userId: '123',
      };
      const result = runCompute(documentDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            documents: [
              {
                documentId: 'abc',
                documentType: 'Stipulated Decision',
                status: 'served',
              },
            ],
          },
          documentId: 'abc',
          user,
        },
      });

      expect(result.showPrintCaseConfirmationButton).toEqual(false);
    });
  });
});
