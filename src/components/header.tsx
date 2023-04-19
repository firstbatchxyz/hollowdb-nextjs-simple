import { useWarpContext } from "@/context/warp.context";
import {
  Box,
  Container,
  Text,
  Group,
  Code,
  Anchor,
  Title,
} from "@mantine/core";
import type { FC } from "react";

const Header: FC = () => {
  const { address } = useWarpContext();
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
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
