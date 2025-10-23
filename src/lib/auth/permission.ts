import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const salesperson = ac.newRole({
  project: ["update"],
  ...memberAc.statements,
});

const general_manager = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update", "delete"],
});

const pickupTable = ac.newRole({
  project: ["update"],
  ...memberAc.statements,
});

const team_manager = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update", "delete"],
});

const member = ac.newRole({
  ...memberAc.statements,
});

export {
  ac,
  general_manager,
  member,
  pickupTable,
  salesperson,
  statement,
  team_manager,
};
