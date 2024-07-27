import { ITestableWindow } from 'types/ITestableWindow';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface IAppContext {
  renderInstanceManagement: boolean;
  setRenderInstanceManagement: (value) => void;
}

const AppContext = createContext({} as IAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [renderInstanceManagement, setRenderInstanceManagement] = useState(
    !process.env.CI,
  );

  // The following code allows us to set whether or not instance management components
  // (components for tracking idle behavior, broadcasting across windows, etc.)
  // should be rendered. For most CI tests, we disable this to prevent interference
  // with cypress tests.
  const setRenderInstanceManagementRef = useRef(setRenderInstanceManagement);
  useEffect(() => {
    setRenderInstanceManagementRef.current = setRenderInstanceManagement;
  }, [setRenderInstanceManagement]);

  // Exposing the ref on the window object so that we can decide when to toggle on or off from cypress
  (window as unknown as ITestableWindow).setRenderInstanceManagement =
    setRenderInstanceManagementRef.current;

  return (
    <AppContext.Provider
      value={{
        renderInstanceManagement,
        setRenderInstanceManagement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
