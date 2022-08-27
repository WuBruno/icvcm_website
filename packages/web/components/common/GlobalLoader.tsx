import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { useRecoilValue } from "recoil";
import { Loader } from "~/recoil/loader";

const GlobalLoader = () => {
  const { loading } = useRecoilValue(Loader);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoader;
