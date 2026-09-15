import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';

// prepareGrantDenyMotionAction returns nothing; tests assert against result.state.
export type GrantDenyActionResult = ReturnType<typeof runAction<void>>;

const wrap = (inner: string): string =>
  `<p class="grant-deny-indent-paragraph">${inner}</p>`;

export const expectedPreamble = ({
  date = 'March 15, 2026',
  documentNumberText = '(doc. no. 7)',
  motionTitle = 'Motion to Compel',
  movant = 'petitioner',
  preamblePrepend = '',
} = {}): string =>
  wrap(
    `${preamblePrepend}On ${date}, ${movant} filed a ${motionTitle} ${documentNumberText}. For cause, it is`,
  );

const motionId = 'motion-docket-entry-id';

export const motion = {
  docketEntryId: motionId,
  documentTitle: 'Motion to Compel',
  filedBy: 'Petr. Jane Doe',
  filingDate: '2026-03-15T10:00:00.000Z',
  index: 7,
};

export const baseCaseDetail = {
  consolidatedCases: [],
  docketEntries: [motion],
  docketNumber: '123-26',
  petitioners: [{ name: 'Jane Doe' }],
  status: CASE_STATUS_TYPES.generalDocket,
};

export const baseState = {
  caseDetail: baseCaseDetail,
  docketEntryId: motionId,
  form: {},
  parentMessageId: undefined,
};
