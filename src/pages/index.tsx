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
  const { hollowdb, isConnected, isLoading } = useWarpContext();
  const [resultData, setResultData] = useState<object>({});
  const [secret, setSecret] = useState<number | "">("");
  const [key, setKey] = useState("00275698acd0ec9de2903fd5a3cef12457534ef46310a995b78ddb5ef864da64");
  const [value, setValue] = useState("");

  async function get() {
    if (!hollowdb) return;
    const result = await hollowdb.get(key);
    setResultData({
      result,
    });
  }

  async function put() {
    if (!hollowdb) return;
    await hollowdb.put(key, value);
  }

  async function update() {
    if (!hollowdb) return;

    // first get the result
    const oldValue = hollowdb.get(key);
    // generate proof
    const notificationId = "proof-generation-notification";
    notifications.show({
      id: notificationId,
      title: "Generating Proof",
      message: "This may take a while...",
      autoClose: false,
    });
    const { proof } = await generateProof(BigInt(secret), oldValue, value);
    notifications.update({
      id: notificationId,
      title: "Done",
      message: "Proof generated!",
      autoClose: 2000,
    });

    // update
    const result = await hollowdb.update(key, value, proof);
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
