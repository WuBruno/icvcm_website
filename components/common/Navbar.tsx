import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import useEagerConnect from "~/hooks/useEagerConnect";
import { Account } from "~/components/accounts";

type Props = {};

const Navbar = (props: Props) => {
  const triedToEagerConnect = useEagerConnect();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, flexGrow: 1, justifyContent: "flex-start" }}
          >
            <Image
              src="/icvcm_logo.svg"
              width={200}
              height={50}
              alt="ICVCM Logo"
            />
          </IconButton>
          <Account triedToEagerConnect={triedToEagerConnect} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
