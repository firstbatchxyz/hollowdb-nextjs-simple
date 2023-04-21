import { useWarpContext } from "@/context/warp.context";
import { Box, Container, Text, Group, Code, Anchor, Title, Button, Popover, ActionIcon } from "@mantine/core";
import Link from "next/link";
import { IconCircleLetterA, IconCurrencyEthereum, IconFileText, IconWallet, IconWalletOff } from "@tabler/icons-react";
import type { FC } from "react";
import constants from "@/constants";

const Header: FC = () => {
  const { address, disconnect, isConnected, isLoading, connectArweave, connectMetaMask } = useWarpContext();
  return (
    <Box component="header" py="md">
      <Container>
        <Group align="center">
          <Link href="/" passHref>
            <Anchor>
              <Title order={3}>HollowDB</Title>
            </Anchor>
          </Link>

          <Link href="/admin" passHref>
            <Anchor>
              <Title order={3}>Admin</Title>
            </Anchor>
          </Link>

          {/* pushes the succeeding contents to the right */}
          <span style={{ flexGrow: 1 }} />
          <Code>{address || "not connected"}</Code>
          {isConnected ? (
            <ActionIcon onClick={() => disconnect()}>
              <IconWalletOff />
            </ActionIcon>
          ) : (
            <Popover width={200} position="bottom" withArrow shadow="md">
              <Popover.Target>
                <ActionIcon>
                  <IconWallet />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Group position="center">
                  <ActionIcon
                    disabled={isLoading || isConnected}
                    onClick={() => {
                      connectArweave();
                    }}
                  >
                    <IconCircleLetterA size="2.5rem" color="black" />
                  </ActionIcon>
                  <ActionIcon
                    disabled={isLoading || isConnected}
                    onClick={() => {
                      connectMetaMask();
                    }}
                  >
                    <IconCurrencyEthereum size="2.5rem" color="gray" />
                  </ActionIcon>
                </Group>
              </Popover.Dropdown>
            </Popover>
          )}
          {/* contract link */}
          <Anchor href={"https://sonar.warp.cc/#/app/contract/" + constants.HOLLOWDB_TEST_TXID} target="_blank">
            <ActionIcon>
              <IconFileText />
            </ActionIcon>
          </Anchor>
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
