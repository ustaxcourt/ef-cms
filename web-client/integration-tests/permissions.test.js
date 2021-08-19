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

const cerebralTest = setupTest();

const publicFieldsVisible = () => {
  expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();
  expect(cerebralTest.getState('caseDetail.caseCaption')).toBeDefined();
  expect(cerebralTest.getState('caseDetail.docketEntries.0')).toBeDefined();
  expect(
    cerebralTest.getState('caseDetail.petitioners.0.contactId'),
  ).toBeDefined();
};

const associatedFieldsVisible = () => {
  const contactPrimary = contactPrimaryFromState(cerebralTest);

  expect(contactPrimary).toMatchObject({
    address1: expect.anything(),
    city: expect.anything(),
    name: expect.anything(),
    phone: expect.anything(),
    state: expect.anything(),
  });
};

const associatedFieldsBlocked = () => {
  const contactPrimary = contactPrimaryFromState(cerebralTest);
  const contactSecondary = contactSecondaryFromState(cerebralTest);

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
  expect(
    cerebralTest.getState('caseDetail.archivedCorrespondences'),
  ).toBeDefined();
  expect(
    cerebralTest.getState('caseDetail.archivedDocketEntries'),
  ).toBeDefined();
  expect(cerebralTest.getState('caseDetail.associatedJudge')).toBeDefined();
  expect(cerebralTest.getState('caseDetail.correspondence')).toBeDefined();
  expect(cerebralTest.getState('caseDetail.statistics')).toBeDefined();
  expect(cerebralTest.getState('caseDetail.status')).toBeDefined();
};

const internalFieldsBlocked = () => {
  expect(
    cerebralTest.getState('caseDetail.archivedCorrespondences'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.archivedDocketEntries'),
  ).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.associatedJudge')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.automaticBlocked')).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.automaticBlockedDate'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.automaticBlockedReason'),
  ).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.blocked')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.blockedDate')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.blockedReason')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.caseNote')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.correspondence')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.damages')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.highPriority')).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.highPriorityReason'),
  ).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.judgeUserId')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.litigationCosts')).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.noticeOfAttachments'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.orderDesignatingPlaceOfTrial'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.orderForAmendedPetition'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.orderForAmendedPetitionAndFilingFee'),
  ).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.orderForFilingFee')).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.orderForOds')).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.orderForRatification'),
  ).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.orderToShowCause')).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.qcCompleteForTrial'),
  ).toBeUndefined();
  expect(cerebralTest.getState('caseDetail.statistics')).toBeUndefined();

  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.draftOrderState'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.editState'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.isDraft'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.judge'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.judgeUserId'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.pending'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.qcAt'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.qcByUserId'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.signedAt'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.signedByUserId'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.signedJudgeName'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.signedJudgeUserId'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.strickenBy'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.strickenByUserId'),
  ).toBeUndefined();
  expect(
    cerebralTest.getState('caseDetail.docketEntries.0.workItem'),
  ).toBeUndefined();
};

const stinVisible = () => {
  expect(
    some(cerebralTest.getState('caseDetail.docketEntries'), {
      eventCode: 'STIN',
    }),
  ).toBe(true);
};

const stinBlocked = () => {
  expect(
    some(cerebralTest.getState('caseDetail.docketEntries'), {
      eventCode: 'STIN',
    }),
  ).toBe(false);
};

const printableDocketRecordVisible = async () => {
  await cerebralTest.runSequence('gotoPrintableDocketRecordSequence', {
    docketNumber: cerebralTest.docketNumber,
  });
  expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
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
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerCreatesNewCase(cerebralTest, fakeFile);
  petitionerViewsCaseDetail(cerebralTest);
  it('Petitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'irsSuperuser@example.com');
  it('IRS Super User views case detail when the case has NOT been served', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  it('Unassociated private practitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  it('Unassociated IRS practitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'petitioner2@example.com');
  it('Unassociated petitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsBlocked();
    internalFieldsBlocked();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket Clerk views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('Petitions Clerk views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinVisible();
    await printableDocketRecordVisible();
  });

  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  it('Petitions Clerk views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('Docket Clerk views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsVisible();
    stinBlocked();
    await printableDocketRecordVisible();
  });

  loginAs(cerebralTest, 'irsSuperuser@example.com');
  it('IRS Super User views case detail when the case has been served', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    publicFieldsVisible();
    associatedFieldsVisible();
    internalFieldsBlocked();
    stinVisible();
    await printableDocketRecordVisible();
  });
});
