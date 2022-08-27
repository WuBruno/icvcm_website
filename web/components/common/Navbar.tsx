import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import Image from "next/image";
import { Account } from "~/components/accounts";
import { useEagerConnect } from "~/hooks/utils";

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
