import Layout from "@/components/layout";
import { useWarpContext } from "@/context/warp.context";
import { Anchor, Box, Button, Group, JsonInput, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import { CreateContract, FromSrcTxContractData, Source, SourceData, Warp, WarpFactory } from "warp-contracts";
import constants from "../constants/index";
import initialState from "../common/initialState";
import { DeployPlugin, InjectedArweaveSigner } from "warp-contracts-plugin-deploy";
import { ArweaveWebWallet } from "arweave-wallet-connector";

const Admin: NextPage = () => {
  const { hollowDBContract, isConnected, isLoading } = useWarpContext();
  const [contractDeployed, setContractDeployed] = useState<boolean>(false);
  const [verkey, setVerkey] = useState<object>({});

  const srcTx: FromSrcTxContractData = {
    srcTxId: constants.HOLLOWDB_TEST_SRCTXID,
    wallet: "use_wallet",
    initState: initialState.toString(),
  };

  async function deployContract() {
    // Will retrieve this one from warp.context.tsx
    const warp: Warp = WarpFactory.forMainnet().use(new DeployPlugin());

    const wallet = new ArweaveWebWallet(
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
    await wallet.connect();
    const userSigner = new InjectedArweaveSigner(wallet);
    await userSigner.setPublicKey();

    const result = await warp.deployFromSourceTx(srcTx, true);
    console.log(result);
  }

  async function updateVerkey() {
    if (!hollowDBContract) return;
    const result = await hollowDBContract.writeInteraction({
      function: "updateState",
      data: {
        newState: {
          verificationKey: verkey,
        },
      },
    });
    notifications.show({
      title: "Done",
      message: <Anchor href={"https://sonar.warp.cc/#/app/interaction/" + result?.originalTxId} />,
    });
  }

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
        <Button disabled={(!contractDeployed && !isConnected) || isLoading} onClick={() => updateVerkey()}>
          Update Verification Key
        </Button>
        <Button disabled={contractDeployed || !isConnected || isLoading} onClick={() => deployContract()}>
          Deploy Contract
        </Button>
      </Stack>
    </Layout>
  );
};

export default Admin;
