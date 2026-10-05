type BootstrapState = {
  isReady: boolean;
};

export const createForceRefreshCallback = ({
  bootstrapState,
  onAppUpdated,
  reloadPage,
}: {
  bootstrapState: BootstrapState;
  onAppUpdated: () => Promise<void>;
  reloadPage: () => void | Promise<void>;
}): (() => Promise<boolean>) => {
  return async (): Promise<boolean> => {
    if (!bootstrapState.isReady) {
      await reloadPage();
      return true;
    }

    await onAppUpdated();
    return false;
  };
};
