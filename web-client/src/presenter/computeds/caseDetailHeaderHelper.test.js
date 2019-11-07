import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from './caseDetailHeaderHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
  {
    ...applicationContext,
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

describe('caseDetailHeaderHelper', () => {
  it('should set showEditCaseButton to true if the user has UPDATE_CASE_CONTENT permission', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { status: Case.STATUS_TYPES.new },
      },
    });
    expect(result.showEditCaseButton).toEqual(true);
  });

  it('should set showEditCaseButton to false if the user does not have UPDATE_CASE_CONTENT permission', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { status: Case.STATUS_TYPES.new },
      },
    });
    expect(result.showEditCaseButton).toEqual(false);
  });

  it('should set showFileFirstDocumentButton and showRequestAccessToCaseButton to false if user role is respondent and the respondent is associated with the case', () => {
    const user = {
      role: User.ROLES.respondent,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [{ userId: '789' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to true if user role is respondent and the respondent is not associated with the case', () => {
    const user = {
      role: User.ROLES.respondent,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(false);
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showFileFirstDocumentButton to true if user role is respondent and there is no respondent associated with the case', () => {
    const user = {
      role: User.ROLES.respondent,
      userId: '789',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileFirstDocumentButton).toEqual(true);
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showPendingAccessToCaseButton to true if user role is practitioner and case is not owned by user but has pending request', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
          pendingAssociation: true,
        },
      },
    });
    expect(result.showPendingAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to true if user role is practitioner and case is not owned by user', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(true);
  });

  it('should set showRequestAccessToCaseButton to false if user role is practitioner and case is owned by user', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });

  it('should set showRequestAccessToCaseButton to false if user role is petitioner and user is not associated with the case', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHeaderHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showRequestAccessToCaseButton).toEqual(false);
  });
});
