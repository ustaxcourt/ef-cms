import { CONTACT_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  contactSecondaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsCaseDetail } from './journey/petitionerViewsCaseDetail';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { some } from 'lodash';

const test = setupTest();

const publicFieldsVisible = () => {
  expect(test.getState('caseDetail.docketNumber')).toBeDefined();
  expect(test.getState('caseDetail.caseCaption')).toBeDefined();
  expect(test.getState('caseDetail.docketEntries.0')).toBeDefined();
  expect(test.getState('caseDetail.petitioners.0.contactId')).toBeDefined();
};

const associatedFieldsVisible = () => {
  const contactPrimary = contactPrimaryFromState(test);

  expect(contactPrimary).toMatchObject({
    address1: expect.anything(),
    city: expect.anything(),
    name: expect.anything(),
    phone: expect.anything(),
    state: expect.anything(),
  });
};

const associatedFieldsBlocked = () => {
  const contactPrimary = contactPrimaryFromState(test);
  const contactSecondary = contactSecondaryFromState(test);

  expect(contactPrimary).toEqual({
    contactId: contactPrimary.contactId,
    contactType: CONTACT_TYPES.primary,
    entityName: 'PublicContact',
    name: expect.anything(),
    state: expect.anything(),
  });
  expect(contactPrimary.address1).toBeUndefined();
  expect(contactSecondary).toBeUndefined();
};

const internalFieldsVisible = () => {
  expect(test.getState('caseDetail.archivedCorrespondences')).toBeDefined();
  expect(test.getState('caseDetail.archivedDocketEntries')).toBeDefined();
  expect(test.getState('caseDetail.associatedJudge')).toBeDefined();
  expect(test.getState('caseDetail.correspondence')).toBeDefined();
  expect(test.getState('caseDetail.statistics')).toBeDefined();
  expect(test.getState('caseDetail.status')).toBeDefined();
};

const internalFieldsBlocked = () => {
  expect(test.getState('caseDetail.archivedCorrespondences')).toBeUndefined();
  expect(test.getState('caseDetail.archivedDocketEntries')).toBeUndefined();
  expect(test.getState('caseDetail.associatedJudge')).toBeUndefined();
  expect(test.getState('caseDetail.automaticBlocked')).toBeUndefined();
  expect(test.getState('caseDetail.automaticBlockedDate')).toBeUndefined();
  expect(test.getState('caseDetail.automaticBlockedReason')).toBeUndefined();
  expect(test.getState('caseDetail.blocked')).toBeUndefined();
  expect(test.getState('caseDetail.blockedDate')).toBeUndefined();
  expect(test.getState('caseDetail.blockedReason')).toBeUndefined();
  expect(test.getState('caseDetail.caseNote')).toBeUndefined();
  expect(test.getState('caseDetail.correspondence')).toBeUndefined();
  expect(test.getState('caseDetail.damages')).toBeUndefined();
  expect(test.getState('caseDetail.highPriority')).toBeUndefined();
  expect(test.getState('caseDetail.highPriorityReason')).toBeUndefined();
  expect(test.getState('caseDetail.judgeUserId')).toBeUndefined();
  expect(test.getState('caseDetail.litigationCosts')).toBeUndefined();
  expect(test.getState('caseDetail.noticeOfAttachments')).toBeUndefined();
  expect(
    test.getState('caseDetail.orderDesignatingPlaceOfTrial'),
  ).toBeUndefined();
  expect(test.getState('caseDetail.orderForAmendedPetition')).toBeUndefined();
  expect(
    test.getState('caseDetail.orderForAmendedPetitionAndFilingFee'),
  ).toBeUndefined();
  expect(test.getState('caseDetail.orderForFilingFee')).toBeUndefined();
  expect(test.getState('caseDetail.orderForOds')).toBeUndefined();
  expect(test.getState('caseDetail.orderForRatification')).toBeUndefined();
  expect(test.getState('caseDetail.orderToShowCause')).toBeUndefined();
  expect(test.getState('caseDetail.qcCompleteForTrial')).toBeUndefined();
  expect(test.getState('caseDetail.statistics')).toBeUndefined();

  expect(
    test.getState('caseDetail.docketEntries.0.draftOrderState'),
  ).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.editState')).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.isDraft')).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.judge')).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.judgeUserId'),
  ).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.pending')).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.qcAt')).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.qcByUserId'),
  ).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.signedAt')).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.signedByUserId'),
  ).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.signedJudgeName'),
  ).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.signedJudgeUserId'),
  ).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.strickenBy'),
  ).toBeUndefined();
  expect(
    test.getState('caseDetail.docketEntries.0.strickenByUserId'),
  ).toBeUndefined();
  expect(test.getState('caseDetail.docketEntries.0.workItem')).toBeUndefined();
};

const stinVisible = () => {
  expect(
    some(test.getState('caseDetail.docketEntries'), { eventCode: 'STIN' }),
  ).toBe(true);
};

const stinBlocked = () => {
  expect(
    some(test.getState('caseDetail.docketEntries'), { eventCode: 'STIN' }),
  ).toBe(false);
};

const printableDocketRecordVisible = async () => {
  await test.runSequence('gotoPrintableDocketRecordSequence', {
    docketNumber: test.docketNumber,
  });
  expect(test.getState('pdfPreviewUrl')).toBeDefined();
};

describe('Case permissions test', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      ...global.window,
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsCaseDetail(test);
  it('Petitioner views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'irsSuperuser@example.com');
  it('IRS Super User views case detail when the case has NOT been served', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'privatePractitioner@example.com');
  it('Unassociated private practitioner views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'irsPractitioner@example.com');
  it('Unassociated IRS practitioner views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'petitioner2@example.com');
  it('Unassociated petitioner views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'docketclerk@example.com');
  it('Docket Clerk views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'petitionsclerk@example.com');
  it('Petitions Clerk views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinVisible();
    await printableDocketRecordVisible();
  });

  petitionsClerkSubmitsCaseToIrs(test);

  it('Petitions Clerk views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'docketclerk@example.com');
  it('Docket Clerk views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(test, 'irsSuperuser@example.com');
  it('IRS Super User views case detail when the case has been served', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinVisible();
    await printableDocketRecordVisible();
  });
});
