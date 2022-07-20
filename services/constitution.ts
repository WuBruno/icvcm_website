import { ICVCMConstitution } from "~/contracts/types/ICVCMConstitution";

export const getPrinciples = async (constitution: ICVCMConstitution) =>
  constitution.getPrinciples();

export const getStrategies = async (constitution: ICVCMConstitution) =>
  constitution.getStrategies();
