import { clearJurisdictionRadioAction } from '../../actions/StatusReportOrder/clearJurisdictionRadioAction';
import { setFormValueAction } from '../../actions/setFormValueAction';
export const updateStatusReportOrderFormValueSequence = [
  setFormValueAction,
  clearJurisdictionRadioAction,
] as unknown as (props: { key: string; value: any }) => void;
