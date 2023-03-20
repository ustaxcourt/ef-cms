module.exports.addPropertyHelper = ({
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

module.exports.makeRequiredHelper = ({
  itemName,
  schema,
  schemaOptionalItems,
}) => {
  if (schemaOptionalItems[itemName]) {
    schema[itemName] = schemaOptionalItems[itemName].required();
  }
};
