import { clearJurisdictionRadioAction } from '../../actions/StatusReportOrderResponse/clearJurisdictionRadioAction';
import { setFormValueAction } from '../../actions/setFormValueAction';
export const updateStatusReportOrderResponseFormValueSequence = [
  setFormValueAction,
  clearJurisdictionRadioAction,
] as unknown as (props: { key: string; value: string }) => void;
