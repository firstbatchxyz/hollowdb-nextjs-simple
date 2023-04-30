import Layout from "@/components/layout";
import { useHollowDBContext } from "@/context/hollowdb.context";
import { Button, JsonInput, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { useState } from "react";

const Admin: NextPage = () => {
  const { admin, isConnected, isLoading } = useHollowDBContext();
  const [verkey, setVerkey] = useState<object>({});

  async function updateVerkey() {
    if (!admin) return;
    await admin.setVerificationKey(verkey as any);
    notifications.show({
      title: "Done",
      message: "Updated verification key!",
    });
  }

  // TODO: add deploy code

  return (
    <Layout>
      <Stack
        style={{
          width: "50vw",
        }}
      >
        <JsonInput
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
        </Button>
      </Stack>
    </Layout>
  );
};

export default Admin;
