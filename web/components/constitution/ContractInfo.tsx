import { Typography } from "@mui/material";
import useSWR from "swr";
import { Contracts } from "~/@types/Roles";
import {
  useICVCMConstitution,
  useICVCMGovernor,
  useICVCMRoles,
  useICVCMToken,
} from "~/hooks/contracts";
import { getContractVersions } from "~/services/constitution";

type Props = {};

const ContractInfo = (props: Props) => {
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMRoles = useICVCMRoles();
  const ICVCMToken = useICVCMToken();
  const ICVCMConstitution = useICVCMConstitution();

  const { data } = useSWR(
    ICVCMGovernor && ICVCMRoles && ICVCMToken && ICVCMConstitution
      ? "getContractVersions"
      : null,
    async () =>
      getContractVersions(
        ICVCMGovernor,
        ICVCMRoles,
        ICVCMToken,
        ICVCMConstitution
      )
  );

  return (
    <div>
      <Typography variant="h6">Contract Versions:</Typography>
      {data &&
        data.map(([version, contract]) => (
          <Typography key={contract}>
            {Contracts[contract]}: {version.toString()}
          </Typography>
        ))}
    </div>
  );
};

export default ContractInfo;
