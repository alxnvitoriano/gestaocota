"use server";

import { canRemoveMembers } from "./permission";

export const checkUserCanRemoveMembers = async (companyId: string) => {
  const permission = await canRemoveMembers(companyId);
  return permission.success;
};
