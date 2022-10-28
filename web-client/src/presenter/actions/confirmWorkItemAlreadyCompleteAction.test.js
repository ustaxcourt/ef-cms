import { confirmWorkItemAlreadyCompleteAction } from './confirmWorkItemAlreadyCompleteAction';
import { runAction } from 'cerebral/test';

describe('confirmWorkItemAlreadyCompleteAction', () => {
  beforeEach(() => {
    global.location = {
      href: '',
    };
  });

  it('should redirect to the section inbox when from page was qc-section-inbox', async () => {
    await runAction(confirmWorkItemAlreadyCompleteAction, {
      state: {
        fromPage: 'qc-section-inbox',
        caseDetail: {
          docketNumber: '101-20',
        },
        constants: {
          FROM_PAGES: {
            qcSectionInbox: 'qc-section-inbox',
          },
        },
      },
    });
    expect(global.location.href).toEqual('/document-qc/section/inbox');
  });

  it('should redirect to the case detail page when fromPage is not qc-section-inbox', async () => {
    await runAction(confirmWorkItemAlreadyCompleteAction, {
      state: {
        fromPage: 'case-detail',
        caseDetail: {
          docketNumber: '101-20',
        },
        constants: {
          FROM_PAGES: {
            qcSectionInbox: 'qc-section-inbox',
          },
        },
      },
    });
    expect(global.location.href).toEqual('/case-detail/101-20');
  });
});
