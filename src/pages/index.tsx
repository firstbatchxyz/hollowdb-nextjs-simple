import Head from "next/head";
import { Inter } from "next/font/google";
import { AppShell, Header, Navbar, Title } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <AppShell
        padding="md"
        header={
          <Header height={60} p="xs">
            <Title>HollowDB Dashboard</Title>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {/* Your application here */}
      </AppShell>
    </>
  );
}
