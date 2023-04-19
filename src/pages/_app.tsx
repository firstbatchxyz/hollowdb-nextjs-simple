import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { WarpContextProvider } from "../context/warp.context";
import { Notifications } from "@mantine/notifications";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>HollowDB Dashboard</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <Notifications />
        <WarpContextProvider>
          <Component {...pageProps} />
        </WarpContextProvider>
      </MantineProvider>
    </>
  );
}
