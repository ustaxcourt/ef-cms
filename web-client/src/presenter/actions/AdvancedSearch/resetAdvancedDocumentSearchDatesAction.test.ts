import { DATE_RANGE_SEARCH_OPTIONS } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { resetAdvancedDocumentSearchDatesAction } from './resetAdvancedDocumentSearchDatesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetAdvancedDocumentSearchDatesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset startDate and endDate when the form dateRange is allDates', async () => {
    const result = await runAction(resetAdvancedDocumentSearchDatesAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: {
            dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
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

  it('should NOT reset startDate and endDate when the form dateRange is NOT allDates', async () => {
    const result = await runAction(resetAdvancedDocumentSearchDatesAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          orderSearch: {
            dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
            endDate: '01/11/2001',
            startDate: '01/01/2001',
          },
        },
      },
    });

    expect(result.state.advancedSearchForm.orderSearch).toMatchObject({
      endDate: '01/11/2001',
      startDate: '01/01/2001',
    });
  });
});
