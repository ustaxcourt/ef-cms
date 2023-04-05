import { state } from 'cerebral';

/**
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for passing props.date
 * @param {object} providers.store the cerebral store used for setting the state.customCaseInventoryFilters.createStartDate or state.customCaseInventoryFilters.createEndDate
 */
export const setStartOrEndCreatedAtDateAction = ({
  applicationContext,
  props,
  store,
}) => {
  if (props.key === 'createStartDate' || props.key === 'createEndDate') {
    const dateForTransformation = props.value;

    const dateWithTime = applicationContext
      .getUtilities()
      .createISODateString(dateForTransformation, 'MM/dd/yyyy'); // TODO: USE FORMATS CONSTANT FROM DATEHANDLER
    console.log('dateWithTime', dateWithTime);

    store.merge(state.customCaseInventoryFilters, {
      [props.key]: dateWithTime,
    });
  } else {
    store.merge(state.customCaseInventoryFilters, {
      [props.key]: props.value,
    });
  }
};

// if (props contains date) transform createISODateString
// if (props contains array-able filters) transform to an array
// store.merge(state stuff)
