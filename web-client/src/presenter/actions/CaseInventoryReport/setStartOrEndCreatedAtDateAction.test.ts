import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setStartOrEndCreatedAtDateAction } from './setStartOrEndCreatedAtDateAction';

presenter.providers.applicationContext = applicationContext;

describe('setStartOrEndCreatedAtDateAction', () => {
  const expectedDate = '2019-05-14T04:00:00.000Z';
  const regularDate = '05/14/2019';

  beforeEach(() => {
    applicationContext
      .getUtilities()
      .createISODateString.mockReturnValue(expectedDate);
  });
  it('should set customCaseInventoryFilters createStartDate in state', async () => {
    const result = await runAction(setStartOrEndCreatedAtDateAction, {
      modules: { presenter },
      props: {
        key: 'createStartDate',
        value: regularDate,
      },
    });

    expect(
      applicationContext.getUtilities().createISODateString,
    ).toHaveBeenCalledWith(regularDate, 'MM/dd/yyyy');

    expect(result.state.customCaseInventoryFilters.createStartDate).toEqual(
      expectedDate,
    );
  });

  it('should set customCaseInventoryFilters createEndDate in state', async () => {
    const result = await runAction(setStartOrEndCreatedAtDateAction, {
      modules: { presenter },
      props: {
        key: 'createEndDate',
        value: regularDate,
      },
    });

    expect(
      applicationContext.getUtilities().createISODateString,
    ).toHaveBeenCalledWith(regularDate, 'MM/dd/yyyy');

    expect(result.state.customCaseInventoryFilters.createEndDate).toEqual(
      expectedDate,
    );
  });

  describe('set filing methods', () => {
    ['all', 'electronic', 'paper'].map(filingMethod => {
      it(`should set customCaseInventoryFilters filing method ${filingMethod} in state`, async () => {
        const result = await runAction(setStartOrEndCreatedAtDateAction, {
          modules: { presenter },
          props: {
            key: 'filingMethod',
            value: filingMethod,
          },
        });

        expect(result.state.customCaseInventoryFilters.filingMethod).toEqual(
          filingMethod,
        );
      });
    });
  });
});
