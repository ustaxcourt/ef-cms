import { runAction } from '@web-client/presenter/test.cerebral';
import { updateAdvancedSearchFormAction } from './updateAdvancedSearchFormAction';

describe('updateAdvancedSearchFormAction', () => {
  it('should set state.advancedSearchForm property to props.formType when formName is undefined', async () => {
    const result = await runAction(updateAdvancedSearchFormAction(), {
      props: {
        formType: 'orderSearch',
        key: 'petitionerName',
        value: 'Price Cole',
      },
      state: {},
    });

    expect(result.state.advancedSearchForm).toEqual({
      orderSearch: {
        petitionerName: 'Price Cole',
      },
    });
  });

  it('should set state.advancedSearchForm property to the value of formName passed in', async () => {
    const result = await runAction(
      updateAdvancedSearchFormAction('opinionSearch'),
      {
        props: {
          formType: 'orderSearch',
          key: 'petitionerName',
          value: 'Price Cole 2',
        },
        state: {},
      },
    );

    expect(result.state.advancedSearchForm).toEqual({
      opinionSearch: {
        petitionerName: 'Price Cole 2',
      },
    });
  });

  it('should unset state.advancedSearchForm property if the value passed in is an empty string', async () => {
    const result = await runAction(
      updateAdvancedSearchFormAction('opinionSearch'),
      {
        props: {
          formType: 'orderSearch',
          key: 'petitionerName',
          value: '',
        },
        state: {},
      },
    );

    expect(result.state.advancedSearchForm).toEqual({
      opinionSearch: {},
    });
  });
});
