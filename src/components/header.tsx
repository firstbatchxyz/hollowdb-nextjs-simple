import { useWarpContext } from "@/context/warp.context";
import {
  Box,
  Container,
  Text,
  Group,
  Code,
  Anchor,
  Title,
  Button,
  Popover,
  ActionIcon,
} from "@mantine/core";
import {
  IconCircleLetterA,
  IconCurrencyEthereum,
  IconWallet,
  IconWalletOff,
} from "@tabler/icons-react";
import type { FC } from "react";

const Header: FC = () => {
  const {
    address,
    disconnect,
    isConnected,
    isLoading,
    connectArweave,
    connectMetaMask,
  } = useWarpContext();
  return (
    <Box component="header" py="md">
      <Container>
        <Group align="center">
          <Anchor href="/" target="_blank">
            <Title order={3}>HollowDB</Title>
          </Anchor>

          {/* pushes the succeeding contents to the right */}
          <span style={{ flexGrow: 1 }} />
          <Code>{address || "not connected"}</Code>
          {isConnected ? (
            <ActionIcon onClick={() => disconnect()}>
              <IconWalletOff size="1.125rem" />
            </ActionIcon>
          ) : (
            <Popover width={200} position="bottom" withArrow shadow="md">
              <Popover.Target>
                <ActionIcon>
                  <IconWallet size="1.125rem" />
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
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
