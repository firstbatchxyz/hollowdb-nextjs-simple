import constants from "@/constants";
import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { CustomSignature, Warp } from "warp-contracts";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import { notifications } from "@mantine/notifications";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { SDK, Admin } from "hollowdb";

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

type HollowDBContextType = {
  sdk: SDK | undefined;
  admin: Admin | undefined;
  isConnected: boolean;
  isLoading: boolean;
  address: string;
  connectArweave: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  disconnect: () => Promise<void>;
};
const HollowDBContext = createContext<HollowDBContextType>({
  sdk: undefined,
  admin: undefined,
  isConnected: false,
  isLoading: false,
  address: "",
  connectArweave: async () => {},
  connectMetaMask: async () => {},
  disconnect: async () => {},
});

export const HollowDBContextProvider: FC<{
  children: ReactNode;
  warp: Warp;
}> = ({ children, warp }) => {
  // arweave
  const [arWallet, setArWallet] = useState<typeof arweaveWebWallet>();
  const isArweaveConnected = useMemo(() => (arWallet ? arWallet.connected : false), [arWallet]);
  // wagmi
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { connect: wagmiConnect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect: wagmiDisconnect } = useDisconnect();
  // common
  const [wallet, setWallet] = useState<"use_wallet" | CustomSignature>();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const isConnected = isArweaveConnected || isWagmiConnected;
  const [sdk, setSDK] = useState<SDK>();
  const [admin, setAdmin] = useState<Admin>();

  // update address automatically
  useEffect(() => {
    if (arWallet && arWallet.address) {
      setAddress(arWallet.address);
    } else if (wagmiAddress) {
      setAddress(wagmiAddress);
    }
  }, [arWallet, wagmiAddress, wallet]);

  // if owner is this wallet, create Admin
  useEffect(() => {
    if (address !== "" && sdk && wallet) {
      sdk.readState().then((hollowState) => {
        const state = hollowState.cachedValue.state;
        if (state.owner === address) {
          setAdmin(new Admin(wallet, constants.HOLLOWDB_TEST_TXID, warp));
        }
      });
    }
  }, [address, sdk, wallet]);

  // if there is wallet, instantiate the SDK
  useEffect(() => {
    if (!wallet) return;
    setSDK(new SDK(wallet, constants.HOLLOWDB_TEST_TXID, warp));
  }, [wallet]);

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
    setWallet("use_wallet");

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
    setWallet({
      // you need to do this lazily, otherwise you get "SubtleCrypto undefined" error
      signer: (await import("warp-contracts-plugin-signature")).evmSignature,
      type: "ethereum",
    });

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
      await arweaveWebWallet.disconnect();
      setArWallet(undefined);
    }
    setSDK(undefined);
    setAddress("");
    setWallet(undefined);
  }

  return (
    <HollowDBContext.Provider
      value={{
        sdk,
        admin,
        isLoading,
        isConnected,
        address,
        connectArweave,
        connectMetaMask,
        disconnect,
      }}
    >
      {children}
    </HollowDBContext.Provider>
  );
};

export function useHollowDBContext() {
  return useContext(HollowDBContext);
}
