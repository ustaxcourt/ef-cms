export const addPropertyHelper = ({
  errorToMessageMap,
  itemErrorMessage,
  itemName,
  itemSchema,
  schema,
}) => {
  schema[itemName] = itemSchema;
  if (itemErrorMessage) {
    errorToMessageMap[itemName] = itemErrorMessage;
  }
};

export const makeRequiredHelper = ({
  itemName,
  schema,
  schemaOptionalItems,
}) => {
  if (schemaOptionalItems[itemName]) {
    schema[itemName] = schemaOptionalItems[itemName].required();
  }
};
