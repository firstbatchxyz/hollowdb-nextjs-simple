import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { WarpContextProvider } from "../context/warp.context";
import { Notifications } from "@mantine/notifications";
// warp
import { WarpFactory } from "warp-contracts";
import { SnarkjsExtension } from "warp-contracts-plugin-snarkjs";
import { EthersExtension } from "warp-contracts-plugin-ethers";
// wagmi
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// instantiate wagmi client
const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()]);
const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
});

// instantiate warp
const warp = WarpFactory.forMainnet().use(new SnarkjsExtension()).use(new EthersExtension());

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>HollowDB Dashboard</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <WagmiConfig client={client}>
          <Notifications />
          <WarpContextProvider warp={warp}>
            <Component {...pageProps} />
          </WarpContextProvider>
        </WagmiConfig>
      </MantineProvider>
    </>
  );
}
