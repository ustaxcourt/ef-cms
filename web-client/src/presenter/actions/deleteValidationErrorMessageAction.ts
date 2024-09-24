import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const deleteValidationErrorMessageAction = ({
  get,
  props,
  store,
}: ActionProps<{
  validationKey: (string | { property: string; value: any })[];
}>) => {
  const { validationKey } = props;
  const validationErrors = cloneDeep(
    get(state.validationErrors),
  ) as unknown as any;

  let root = validationErrors;

  for (let index = 0; index < validationKey.length - 1; index++) {
    if (!root) return;

    const key = validationKey[index];
    if (typeof key === 'string') root = root[key];
    if (typeof key === 'object' && Array.isArray(root))
      root = root.find(item => item[key.property] === key.value);
  }

  const finalKey = validationKey[validationKey.length - 1];
  if (root && typeof finalKey === 'string' && root[finalKey])
    delete root[finalKey];

  store.set(state.validationErrors, validationErrors);
};
