import { presenter } from '../../presenter-mock';
import { resetAdvancedDocumentSearchDatesAction } from './resetAdvancedDocumentSearchDatesAction';
import { runAction } from 'cerebral/test';

describe('resetAdvancedDocumentSearchDatesAction', () => {
  it('should unset startDate and endDate when the form dateRange is allDates', async () => {
    const result = await runAction(resetAdvancedDocumentSearchDatesAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: {
            dateRange: 'allDates',
            endDate: '01/11/2001',
            startDate: '01/01/2001',
          },
        },
      },
    });

    expect(
      result.state.advancedSearchForm.orderSearch.startDate,
    ).toBeUndefined();
    expect(result.state.advancedSearchForm.orderSearch.endDate).toBeUndefined();
  });
});
