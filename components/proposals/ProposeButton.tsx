import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useAsync, useICVCMGovernor, useICVCMToken } from "~/hooks";
import { propose } from "~/services/ICVCMGovernor";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ProposeButton = () => {
  const [open, setOpen] = useState(false);
  const { account } = useWeb3React();
  const [_, submit] = useAsync(submitProposal);
  const ICVCMGovernor = useICVCMGovernor();
  const ICVCMToken = useICVCMToken();
  const [value, setValue] = useState('Controlled');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  async function submitProposal() {
    setOpen(false);
    const proposalId = await propose(ICVCMGovernor, ICVCMToken, account, value);
    console.log(proposalId);
  };

  return <div>
    <Button variant="contained" onClick={() => setOpen(true)}>Create Proposal</Button>

    <Modal open={open} onClose={() => setOpen(false)}>
      <Stack spacing={2} sx={style}>
        <Typography variant="h5">
          Create Proposal
        </Typography>
        <TextField label="Description" multiline onChange={handleChange} />
        <Button variant="contained" onClick={submit}>Propose</Button>
      </Stack>
    </Modal>
  </div >;
};

export default ProposeButton;