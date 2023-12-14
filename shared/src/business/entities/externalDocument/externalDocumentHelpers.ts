export const addPropertyHelper = ({ itemName, itemSchema, schema }) => {
  schema[itemName] = itemSchema;
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
