import Layout from "@/components/layout";
import { useWarpContext } from "@/context/warp.context";
import { Anchor, Box, Button, Group, JsonInput, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

const Admin: NextPage = () => {
  // const { hollowDBContract, isConnected, isLoading } = useWarpContext();
  // const [verkey, setVerkey] = useState<object>({});

  // async function updateVerkey() {
  //   if (!hollowDBContract) return;
  //   const result = await hollowDBContract.writeInteraction({
  //     function: "updateState",
  //     data: {
  //       newState: {
  //         verificationKey: verkey,
  //       },
  //     },
  //   });
  //   notifications.show({
  //     title: "Done",
  //     message: <Anchor href={"https://sonar.warp.cc/#/app/interaction/" + result?.originalTxId} />,
  //   });
  // }

  return (
    <Layout>
      <Stack
        style={{
          width: "50vw",
        }}
      >
        {/* <JsonInput
          label="Verification Key"
          validationError="Invalid JSON"
          onChange={(val) => {
            try {
              const obj = JSON.parse(val);
              setVerkey(obj);
            } catch (err) {}
          }}
          formatOnBlur
          autosize
          minRows={4}
          maxRows={10}
        />
        <Button disabled={!isConnected || isLoading} onClick={() => updateVerkey()}>
          Update Verification Key
        </Button> */}
      </Stack>
    </Layout>
  );
};

export default Admin;
