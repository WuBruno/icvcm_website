export enum Roles {
  Director = 0,
  Expert,
  Secretariat,
  Regulator,
}

export type Member = {
  role: Roles;
  name: string;
  memberAddress: string;
};

export enum Contracts {
  ICVCMRoles,
  ICVCMGovernor,
  ICVCMConstitution,
  ICVCMToken,
}

export type ProposalAuthorization = {
  role: Roles;
  contract: Contracts;
  function: string;
};
