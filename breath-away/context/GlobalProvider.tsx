import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AppwriteService from "../lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  showInstructions: boolean;
  toggleShowInstructions: (value: boolean) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("No context");
  }
  return context;
}

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    AppwriteService.getCurrentUser()
      .then((res: any) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    AsyncStorage.getItem("showInstructions").then((value) => {
      setShowInstructions(value === "true");
    });
  }, []);

  const toggleShowInstructions = (value: boolean) => {
    setShowInstructions(value);
    AsyncStorage.setItem("showInstructions", value.toString());
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        showInstructions,
        toggleShowInstructions,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
