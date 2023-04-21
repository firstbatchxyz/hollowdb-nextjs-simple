import Layout from "@/components/layout";
import { useWarpContext } from "@/context/warp.context";
import { computeKey, generateProof } from "@/lib/prover";
import { ActionIcon, Box, Button, Group, NumberInput, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLock } from "@tabler/icons-react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const Home: NextPage = () => {
  const { hollowDBContract, isConnected, isLoading } = useWarpContext();
  const [resultData, setResultData] = useState<object>({});
  const [secret, setSecret] = useState<number | "">("");
  const [key, setKey] = useState("00275698acd0ec9de2903fd5a3cef12457534ef46310a995b78ddb5ef864da64");
  const [value, setValue] = useState("");

  async function get() {
    if (!hollowDBContract) return;
    const result = await hollowDBContract.viewState({
      function: "get",
      data: {
        key,
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

  async function put() {
    if (!hollowDBContract) return;
    const result = await hollowDBContract.writeInteraction({
      function: "put",
      data: {
        key: key,
        value: value,
      },
    });

    setResultData({
      txId: result?.originalTxId,
    });
  }

  async function update() {
    if (!hollowDBContract) return;

    // first get the result
    const getResult = await hollowDBContract.viewState({
      function: "get",
      data: {
        key,
      },
    });
    if (getResult.type !== "ok") {
      notifications.show({
        title: "GET failed",
        message: "An error occured during GET",
        color: "red",
      });
    }

    // generate proof
    const notificationId = "proof-generation-notification";
    notifications.show({
      id: notificationId,
      title: "Generating Proof",
      message: "This may take a while...",
      autoClose: false,
    });
    const { proof } = await generateProof(BigInt(secret), getResult.result, value);
    notifications.update({
      id: notificationId,
      title: "Done",
      message: "Proof generated!",
      autoClose: 2000,
    });

    // update
    const result = await hollowDBContract.writeInteraction({
      function: "update",
      data: {
        key: key,
        value: value,
        proof: proof,
      },
    });

    setResultData({
      txId: result?.originalTxId,
    });
  }

  return (
    <Layout>
      <Stack
        style={{
          width: "50vw",
        }}
      >
        <NumberInput label="Secret" value={secret} placeholder="1234" min={0} onChange={(num) => setSecret(num)} />
        <TextInput
          label="Key"
          value={key}
          onChange={(e) => setKey(e.currentTarget.value)}
          rightSection={
            <ActionIcon onClick={() => secret !== "" && setKey(computeKey(BigInt(secret)))}>
              <IconLock />
            </ActionIcon>
          }
        />
        <TextInput
          label="Value"
          placeholder="some string"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />

        <Group position="center">
          <Button
            style={{
              width: "100px",
            }}
            size="xs"
            disabled={!isConnected || isLoading}
            onClick={() => get()}
          >
            GET
          </Button>
          <Button
            color="blue"
            style={{
              width: "100px",
            }}
            size="xs"
            disabled={!isConnected || isLoading}
            onClick={() => put()}
          >
            PUT
          </Button>

          <Button
            color="orange"
            style={{
              width: "100px",
            }}
            size="xs"
            disabled={!isConnected || isLoading}
            onClick={() => update()}
          >
            UPDATE
          </Button>
        </Group>

        <DynamicReactJson src={resultData} collapsed enableClipboard={false} name={null} />
      </Stack>
    </Layout>
  );
};

export default Home;
