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
}): (() => Promise<void>) => {
  return async (): Promise<void> => {
    if (!bootstrapState.isReady) {
      await reloadPage();
      return;
    }

    await onAppUpdated();
  };
};
