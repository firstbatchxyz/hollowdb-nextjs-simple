import { Box, Container, Text, Group } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
const Header: FC = () => {
  return (
    <Box component="header" py="md">
      <Container>
        <Group align="center">
          <Text sx={{ fontSize: "1.5em", fontWeight: 800 }}>
            <Link href="/">HollowDB</Link>
          </Text>

          {/* pushes the succeeding contents to the right */}
          <span style={{ flexGrow: 1 }} />
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
