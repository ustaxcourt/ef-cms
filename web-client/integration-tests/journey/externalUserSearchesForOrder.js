import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { wait } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

export const externalUserSearchesForOrder = (test, options) => {
  return it('external user searches for an order', async () => {
    test.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'onomatopoeia',
      },
    });

    await test.runSequence('submitOrderAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.draftOrders[0].documentId,
        }),
      ]),
    );
  });
};
