export type IdleLogoutTesting = {
  idleActivityMonitor?: {
    isInTestingMode?: boolean;
    sessionTimeout?: number;
    areYouStillThereTime?: number;
  };
};

export const overrideIdleTimeouts = ({
  areYouStillThereTime,
  sessionTimeout,
  windowObj, // For native cypress, this needs to be defined. For the puppeteer plugin, it should be left blank.
}: {
  areYouStillThereTime: number;
  sessionTimeout: number;
  windowObj?: IdleLogoutTesting;
}) => {
  const currentWindow = windowObj || (window as unknown as IdleLogoutTesting);
  currentWindow.idleActivityMonitor = {
    areYouStillThereTime,
    sessionTimeout,
  };
};
