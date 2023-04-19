import constants from "@/constants";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { Warp, Contract, WarpFactory } from "warp-contracts";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import { notifications } from "@mantine/notifications";

// instantiate warp
const warp = WarpFactory.forMainnet();

const arweaveWebWallet = new ArweaveWebWallet(
  {
    name: "HollowDB Tester",
    logo: "https://avatars.githubusercontent.com/u/107621806?s=200&v=4",
  },
  {
    state: {
      url: "arweave.app",
    },
  }
);

type WarpContextType = {
  warp: Warp;
  hollowDBContract: Contract<unknown> | undefined; // can add HollowDB state here
  isConnected: boolean;
  isLoading: boolean;
  address: string;
  connectArweave: () => Promise<void>;
  disconnectArweave: () => Promise<void>;
};
const WarpContext = createContext<WarpContextType>({
  warp,
  hollowDBContract: undefined,
  isConnected: false,
  isLoading: false,
  address: "",
  connectArweave: async () => {},
  disconnectArweave: async () => {},
});

export const WarpContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [wallet, setWallet] = useState<typeof arweaveWebWallet>();
  const [hollowDBContract, setHollowDBContract] = useState<Contract<unknown>>();
  const isConnected = useMemo(
    () => (wallet ? wallet.connected : false),
    [wallet]
  );
  const [isLoading, setIsLoading] = useState(false);
  const address = wallet?.address || "";

  async function connectArweave() {
    setIsLoading(true);

    // connect to wallet
    await arweaveWebWallet.connect();
    setWallet(arweaveWebWallet);

    // connect to wallet
    const contract = warp
      .contract(constants.HOLLOWDB_TEST_TXID)
      .setEvaluationOptions({
        allowBigInt: true,
      })
      .connect("use_wallet");
    setHollowDBContract(contract);

    setIsLoading(false);
    notifications.show({
      title: "Connected!",
      message: "Successfully connected to Arweave.",
      color: "green",
    });
  }

  async function disconnectArweave() {
    // disconnect
    setWallet(undefined);
    setHollowDBContract(undefined);
  }

  return (
    <WarpContext.Provider
      value={{
        warp,
        hollowDBContract,
        isLoading,
        isConnected,
        address,
        connectArweave,
        disconnectArweave,
      }}
    >
      {children}
    </WarpContext.Provider>
  );
};

export function useWarpContext() {
  return useContext(WarpContext);
}
