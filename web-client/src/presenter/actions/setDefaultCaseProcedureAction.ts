import { PROCEDURE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultCaseProcedureAction = ({ store }: ActionProps) => {
  store.set(state.form.procedureType, PROCEDURE_TYPES_MAP.regular);
};
