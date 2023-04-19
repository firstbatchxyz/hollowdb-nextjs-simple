import { useWarpContext } from "@/context/warp.context";
import { Box, Button, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import dynamic from "next/dynamic";
import { FC, useState } from "react";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const WalletTest: FC = () => {
  const {
    hollowDBContract,
    isConnected,
    isLoading,
    connectArweave,
    address,
    disconnectArweave,
  } = useWarpContext();
  const [resultData, setResultData] = useState<object>({});

  async function test() {
    if (!hollowDBContract) return;

    const result = await hollowDBContract.viewState({
      function: "get",
      data: {
        key: "00275698acd0ec9de2903fd5a3cef12457534ef46310a995b78ddb5ef864da64",
      },
    });

    if (result.type !== "ok") {
      notifications.show({
        title: "GET failed",
        message: "An error occured during GET",
        color: "red",
      });
    } else {
      setResultData({
        result: result.result,
        type: result.type,
        error: result.errorMessage,
      });
    }
  }

  return (
    <Box>
      <Stack
        style={{
          width: "50vw",
        }}
      >
        <Button
          disabled={isLoading}
          onClick={() => {
            isConnected ? disconnectArweave() : connectArweave();
          }}
        >
          {isConnected ? "Disconnect" : "Connect with Arweave"}
        </Button>
        <Button disabled={!isConnected || isLoading} onClick={() => test()}>
          Test
        </Button>
        <DynamicReactJson
          src={resultData}
          collapsed
          enableClipboard={false}
          name={null}
        />
      </Stack>
    </Box>
  );
};

export default WalletTest;
