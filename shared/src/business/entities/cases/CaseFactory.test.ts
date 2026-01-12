import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { INITIAL_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  mockDocketClerkUser,
  mockIrsSuperuser,
  mockJudgeUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';

const MOCK_UNSERVED_CASE = MOCK_CASE;
const MOCK_UNSERVED_AND_SEALED_CASE = {
  ...MOCK_UNSERVED_CASE,
  isSealed: true,
};
const MOCK_UNSERVED_CASE_WITH_SEALED_ADDRESS = {
  ...MOCK_UNSERVED_CASE,
  petitioners: MOCK_UNSERVED_CASE.petitioners.map(p => ({
    ...p,
    isAddressSealed: true,
  })),
};
const MOCK_SERVED_CASE = {
  ...MOCK_UNSERVED_CASE,
  docketEntries: MOCK_UNSERVED_CASE.docketEntries.map(d => {
    if (d.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode) {
      return { ...d, servedAt: '2019-08-25T05:00:00.000Z' }; // Ensure that the petition is served
    } else {
      return d;
    }
  }),
};
const MOCK_SERVED_CASE_WITH_SEALED_ADDRESS = {
  ...MOCK_SERVED_CASE,
  petitioners: MOCK_UNSERVED_CASE.petitioners.map(p => ({
    ...p,
    isAddressSealed: true,
  })),
};
// We finesse things to make MOCK_UNSERVED_CASE a member of MOCK_LEAD_CASE
const MOCK_LEAD_CASE = {
  ...MOCK_UNSERVED_CASE,
  docketNumber: '101-23',
  leadDocketNumber: '101-23',
  petitioners: MOCK_UNSERVED_CASE.petitioners.map(p => ({
    ...p,
    contactId: getUniqueId(), // We don't want any test petitioner to be associated with the lead case, only the member case
  })),
  consolidatedCases: [{ ...MOCK_UNSERVED_CASE, leadDocketNumber: '101-23' }],
};

const INTERNAL_USER_WHO_CAN_SEE_SEALED_CASES = mockDocketClerkUser;
const INTERNAL_USER_WHO_CANNOT_SEE_SEALED_CASES = mockJudgeUser;
const PETITIONER_ASSOCIATED_WITH_MOCK_UNSERVED_CASE = {
  ...mockPetitionerUser,
  userId: MOCK_UNSERVED_CASE.petitioners[0].contactId,
};
const PETITIONER_NOT_ASSOCIATED_WITH_MOCK_UNSERVED_CASE = mockPetitionerUser;

describe('CaseFactory', () => {
  describe('internal user', () => {
    it('should get full case data for unsealed case', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_CASE,
        user: INTERNAL_USER_WHO_CANNOT_SEE_SEALED_CASES,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect(caseData.docketEntries).toMatchObject(
        MOCK_UNSERVED_CASE.docketEntries,
      );
    });
    it('should get full case data for sealed case', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_AND_SEALED_CASE,
        user: INTERNAL_USER_WHO_CANNOT_SEE_SEALED_CASES,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect(caseData.docketEntries).toMatchObject(
        MOCK_UNSERVED_AND_SEALED_CASE.docketEntries,
      );
    });
    it('should not show sealed addresses when user does not have permissions', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_CASE_WITH_SEALED_ADDRESS,
        user: INTERNAL_USER_WHO_CANNOT_SEE_SEALED_CASES,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect((caseData as Case).petitioners[0].address1).toBeFalsy();
    });
    it('should show sealed addresses when user has permissions', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_CASE_WITH_SEALED_ADDRESS,
        user: INTERNAL_USER_WHO_CAN_SEE_SEALED_CASES,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect((caseData as Case).petitioners[0].address1).toBeTruthy();
    });
  });
  describe('irs superuser for case with served petition', () => {
    it('should get a full case', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_SERVED_CASE,
        user: mockIrsSuperuser,
      });
      expect(caseData).toBeInstanceOf(Case);
    });
    it('should show the STIN docket entry, but no other docket entries that are not on the record', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_SERVED_CASE,
        user: mockIrsSuperuser,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect(caseData.docketEntries).toMatchObject(
        MOCK_SERVED_CASE.docketEntries.filter(
          d =>
            d.isOnDocketRecord ||
            d.eventCode == INITIAL_DOCUMENT_TYPES.stin.eventCode,
        ),
      );
    });
    it('should not show sealed addresses', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_SERVED_CASE_WITH_SEALED_ADDRESS,
        user: mockIrsSuperuser,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect((caseData as Case).petitioners[0].address1).toBeFalsy();
    });
  });
  describe('external, logged-in user associated with the case', () => {
    it('should get full case data for unsealed case except docket entries not on the record', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_CASE,
        user: PETITIONER_ASSOCIATED_WITH_MOCK_UNSERVED_CASE,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect(caseData.docketEntries).toMatchObject(
        MOCK_UNSERVED_CASE.docketEntries.filter(d => d.isOnDocketRecord),
      );
    });
    it('should get full case data for sealed case except docket entries not on the record', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_AND_SEALED_CASE,
        user: PETITIONER_ASSOCIATED_WITH_MOCK_UNSERVED_CASE,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect(caseData.docketEntries).toMatchObject(
        MOCK_UNSERVED_AND_SEALED_CASE.docketEntries.filter(
          d => d.isOnDocketRecord,
        ),
      );
    });
    it('should get full data for lead case when associated with a member case', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_LEAD_CASE,
        user: PETITIONER_ASSOCIATED_WITH_MOCK_UNSERVED_CASE,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect(caseData.docketEntries).toMatchObject(
        MOCK_LEAD_CASE.docketEntries.filter(d => d.isOnDocketRecord),
      );
    });
    it('should not show sealed addresses', () => {
      const caseData = CaseFactory.getCase({
        rawCase: MOCK_UNSERVED_CASE_WITH_SEALED_ADDRESS,
        user: PETITIONER_ASSOCIATED_WITH_MOCK_UNSERVED_CASE,
      });
      expect(caseData).toBeInstanceOf(Case);
      expect((caseData as Case).petitioners[0].address1).toBeFalsy();
    });
  });
  // Other scenarios should give case data that only a non-logged-in user could see
  describe.each([
    ['IRS Superuser', mockIrsSuperuser],
    ['Non-logged-in-user', undefined],
    [
      'Petitioner not associated with case',
      PETITIONER_NOT_ASSOCIATED_WITH_MOCK_UNSERVED_CASE,
    ],
  ])('for user %s', (_, user) => {
    describe('when case is unsealed', () => {
      it('should get publicly accessible data', () => {
        const caseData = CaseFactory.getCase({
          rawCase: MOCK_UNSERVED_CASE,
          user,
        });
        expect(caseData).toBeInstanceOf(PublicCase);
        expect(caseData.docketEntries).toMatchObject(
          MOCK_UNSERVED_CASE.docketEntries
            .filter(d => d.isOnDocketRecord)
            .map(d => ({ docketEntryId: d.docketEntryId })),
        );
      });
    });

    describe('when case is sealed', () => {
      it('should get restricted access', () => {
        const caseData = CaseFactory.getCase({
          rawCase: MOCK_UNSERVED_AND_SEALED_CASE,
          user,
        });
        expect(caseData).toBeInstanceOf(RestrictedCase);
        expect(caseData.docketEntries).toHaveLength(0);
      });
    });
  });
});
