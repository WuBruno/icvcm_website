export enum Roles {
  Director = 0,
  Expert,
  Secretariat,
}

export type Member = {
  role: Roles;
  name: string;
  memberAddress: string;
};
