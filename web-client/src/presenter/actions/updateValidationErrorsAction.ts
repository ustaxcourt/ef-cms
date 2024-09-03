import { state } from '@web-client/presenter/app.cerebral';

// TODO: Test more thoroughly
function recursiveMerge(obj1, obj2) {
  // Iterate through the properties of obj2
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      // Check if the value at the key in both objects is an array
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        // Merge arrays by index identifier
        obj2[key].forEach(newItem => {
          const existingItem = obj1[key].find(
            item => item.index === newItem.index,
          );
          if (existingItem) {
            // Recursively merge matching items
            recursiveMerge(existingItem, newItem);
          } else {
            // Push new item if no match found
            obj1[key].push(newItem);
          }
        });
      } else if (
        typeof obj1[key] === 'object' &&
        typeof obj2[key] === 'object'
      ) {
        // Recursively merge objects
        recursiveMerge(obj1[key], obj2[key]);
      } else {
        // Directly set the value if not both arrays or objects
        obj1[key] = obj2[key];
      }
    }
  }
}

export const updateValidationErrorsAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const validationErrors = get(state.validationErrors);
  const newValidationErrors: Record<string, string> = props.errors;
  recursiveMerge(validationErrors, newValidationErrors);
  store.set(state.validationErrors, validationErrors);
};
