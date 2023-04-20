import constants from "@/constants";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Warp, Contract, WarpFactory, CustomSignature } from "warp-contracts";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import { evmSignature } from "warp-contracts-plugin-signature";
import { notifications } from "@mantine/notifications";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// instantiate warp
const warp = WarpFactory.forMainnet();

// instantiate Arweave Web Wallet
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
  connectMetaMask: () => Promise<void>;
  disconnect: () => Promise<void>;
};
const WarpContext = createContext<WarpContextType>({
  warp,
  hollowDBContract: undefined,
  isConnected: false,
  isLoading: false,
  address: "",
  connectArweave: async () => {},
  connectMetaMask: async () => {},
  disconnect: async () => {},
});

export const WarpContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  // arweave
  const [arWallet, setArWallet] = useState<typeof arweaveWebWallet>();
  const isArweaveConnected = useMemo(
    () => (arWallet ? arWallet.connected : false),
    [arWallet]
  );
  // wagmi
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { connect: wagmiConnect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect: wagmiDisconnect } = useDisconnect();
  // common
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const isConnected = isArweaveConnected || isWagmiConnected;
  // contracts
  const [hollowDBContract, setHollowDBContract] = useState<Contract<unknown>>();

  // update address automatically
  useEffect(() => {
    if (arWallet && arWallet.address) {
      setAddress(arWallet.address);
    } else if (wagmiAddress) {
      setAddress(wagmiAddress);
    }
  }, [arWallet, wagmiAddress]);

  async function connectArweave() {
    if (isWagmiConnected) {
      return notifications.show({
        title: "Already connected",
        message: "You are already connected with MetaMask.",
        color: "red",
      });
    }
    setIsLoading(true);

    await arweaveWebWallet.connect();
    setArWallet(arweaveWebWallet);

    const contract = warp
      .contract(constants.HOLLOWDB_TEST_TXID)
      .setEvaluationOptions({
        allowBigInt: true,
      })
      .connect("use_wallet");
    setHollowDBContract(contract);

    setIsLoading(false);
    notifications.show({
      title: "Connected",
      message: "Successfully connected to Arweave.",
      color: "green",
    });
  }

  async function connectMetaMask() {
    if (isArweaveConnected) {
      return notifications.show({
        title: "Already connected",
        message: "You are already connected to Arweave.",
        color: "red",
      });
    }
    setIsLoading(true);

    wagmiConnect();

    const contract = warp
      .contract(constants.HOLLOWDB_TEST_TXID)
      .setEvaluationOptions({
        allowBigInt: true,
      })
      .connect({
        signer: evmSignature,
        type: "ethereum",
      });
    setHollowDBContract(contract);

    setIsLoading(false);
    notifications.show({
      title: "Connected!",
      message: "Successfully connected to MetaMask.",
      color: "green",
    });
  }

  async function disconnect() {
    if (isWagmiConnected) {
      wagmiDisconnect();
    }
    if (isArweaveConnected) {
      setArWallet(undefined);
    }
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
        connectMetaMask,
        disconnect,
      }}
    >
      {children}
    </WarpContext.Provider>
  );
};

export function useWarpContext() {
  return useContext(WarpContext);
}
