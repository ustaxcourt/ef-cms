import { runCompute } from '@web-client/presenter/test.cerebral';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { fileDocumentHelper as fileDocumentHelperComputed } from './fileDocumentHelper';
import { withAppContextDecorator } from '../../withAppContext';
import { applicationContextForClient as applicationContext } from '../../test/createClientTestApplicationContext';
import {
  casePetitioner,
  irsPractitionerUser,
  privatePractitionerUser,
} from '../../../../shared/src/test/mockUsers';

describe('fileDocumentHelper', () => {
  const state = {
    caseDetail: MOCK_CASE,
    featureFlags: {},
    form: {} as any,
    validationErrors: {},
  };
  const fileDocumentHelper = withAppContextDecorator(
    fileDocumentHelperComputed,
    applicationContext,
  );
  beforeEach(() => {
    state.form = {};
  });

  describe('allowExternalConsolidatedGroupFiling', () => {
    it('should set allowExternalConsolidatedGroupFiling to false if the user is an IRS practitioner and the eventCode is not allowed', () => {
      state.form = {
        eventCode: 'NOTW',
      };
      state.caseDetail = {
        ...state.caseDetail,
        leadDocketNumber: '123-45',
      };
      const result: any = runCompute(fileDocumentHelper, {
        state: { ...state, user: irsPractitionerUser },
      });
      expect(result.allowExternalConsolidatedGroupFiling).toEqual(false);
    });
    it('should set allowExternalConsolidatedGroupFiling to false if the user is private practitioner and the eventCode is not allowed', () => {
      state.form = {
        eventCode: 'NOTW',
      };
      const result: any = runCompute(fileDocumentHelper, {
        state: { ...state, user: privatePractitionerUser },
      });
      expect(result.allowExternalConsolidatedGroupFiling).toEqual(false);
    });
    it('should set allowExternalConsolidatedGroupFiling to true if the user is a petitioner and the eventCode is allowed', () => {
      state.form = {
        eventCode: 'A',
      };
      const result: any = runCompute(fileDocumentHelper, {
        state: { ...state, user: casePetitioner },
      });
      expect(result.allowExternalConsolidatedGroupFiling).toEqual(true);
    });
    it('should set allowExternalConsolidatedGroupFiling to true if the user is a practitioner and the eventCode is allowed', () => {
      state.form = {
        eventCode: 'A',
      };
      const result: any = runCompute(fileDocumentHelper, {
        state: { ...state, user: privatePractitionerUser },
      });
      expect(result.allowExternalConsolidatedGroupFiling).toEqual(true);
    });
  });
});
