export const isEditOrderResponseAction = ({ path, props }: ActionProps) => {
  if (props.isEditing) {
    return path.edit({
      docketEntryIdToEdit: props.docketEntryId ?? props.docketEntryIdToEdit, // Yuck. Sometimes we look for docketEntryId, sometimes for docketEntryIdToEdit.
    });
  }
  return path.create();
};
