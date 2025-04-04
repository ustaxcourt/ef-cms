export const isEditMotionOrderResponseAction = ({ path, props }: ActionProps) => {
    if (props.isEditing) {
      return path.edit({ docketEntryIdToEdit: props.docketEntryId });
    }
    return path.create();
  };