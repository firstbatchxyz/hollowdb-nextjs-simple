import constants from "@/constants";
import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Warp, Contract, WarpFactory } from "warp-contracts";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import { notifications } from "@mantine/notifications";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { SnarkjsExtension } from "warp-contracts-plugin-snarkjs";
import { EthersExtension } from "warp-contracts-plugin-ethers";
import { SDK } from "hollowdb";

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
  hollowdb: SDK | undefined; // can add HollowDB state here
  isConnected: boolean;
  isLoading: boolean;
  address: string;
  connectArweave: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  disconnect: () => Promise<void>;
};
const WarpContext = createContext<WarpContextType>({
  hollowdb: undefined,
  isConnected: false,
  isLoading: false,
  address: "",
  connectArweave: async () => {},
  connectMetaMask: async () => {},
  disconnect: async () => {},
});

export const WarpContextProvider: FC<{
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
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const isConnected = isArweaveConnected || isWagmiConnected;
  const [hollowdb, setHollowdb] = useState<SDK>();

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

    const hollowdb = new SDK({
      signer: "use_wallet",
      warp: warp,
      cacheType: "lmdb",
      contractTxId: constants.HOLLOWDB_TEST_TXID,
    });
    setHollowdb(hollowdb);
    // const contract = warp
    //   .contract(constants.HOLLOWDB_TEST_TXID)
    //   .setEvaluationOptions({
    //     allowBigInt: true,
    //   })
    //   .connect("use_wallet");
    // setHollowDBContract(contract);

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

    const hollowdb = new SDK({
      signer: {
        // you need to do this lazily, otherwise you get "SubtleCrypto undefined" error
        signer: (await import("warp-contracts-plugin-signature")).evmSignature,
        type: "ethereum",
      },
      warp: warp,
      cacheType: "lmdb",
      contractTxId: constants.HOLLOWDB_TEST_TXID,
    });
    setHollowdb(hollowdb);
    // if you get SubtleCrypto error, just comment out this part,
    // and then uncomment again and it should work
    // const contract = warp
    //   .contract(constants.HOLLOWDB_TEST_TXID)
    //   .setEvaluationOptions({
    //     allowBigInt: true,
    //   })
    //   .connect({
    //     // you need to do this lazily, otherwise you get "SubtleCrypto undefined" error
    //     signer: (await import("warp-contracts-plugin-signature")).evmSignature,
    //     type: "ethereum",
    //   });
    // setHollowDBContract(contract);

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
    setHollowdb(undefined);
    setAddress("");
  }

  return (
    <WarpContext.Provider
      value={{
        hollowdb,
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
