import { atom } from "recoil";

// Folder structure reference https://codesandbox.io/s/iprvo?file=/src/recoil/example/index.ts
const loadingState = atom({
  key: "loader",
  default: {
    loading: false,
  },
});

export default loadingState;
