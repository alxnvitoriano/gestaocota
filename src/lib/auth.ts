import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

import CompanyInvitationEmail from "@/app/(protected)/team/teams/[slug]/components/company-invitation";
import { db } from "@/db";
import * as schema from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY as string);

import {
  general_manager,
  member,
  pickupTable as pickup,
  salesperson,
  team_manager,
} from "./auth/permission";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://gestaocota.com.br",
    "https://www.gestaocota.com.br",
  ],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        try {
          const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/accept-invitation/${data.id}`;

          await resend.emails.send({
            from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_EMAIL}>`,
            to: data.email,
            subject: "Você foi convidado para um time.",
            react: CompanyInvitationEmail({
              email: data.email,
              invitedByUsername: data.inviter.user.name,
              invitedByEmail: data.inviter.user.email,
              CompanyName: data.organization.name,
              inviteLink,
            }),
          });
        } catch (error) {
          throw error;
        }
      },
      roles: {
        member,
        salesperson,
        general_manager,
        team_manager,
        pickup,
      },
      schema: {
        organization: {
          modelName: "companyTable",
          fields: {
            name: "name",
            slug: "slug",
            metadata: "metadata",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
          },
        },
        member: {
          modelName: "member",
          fields: {
            organizationId: "companyId",
            userId: "userId",
            role: "role",
            createdAt: "createdAt",
          },
        },
        invitation: {
          modelName: "invitation",
          fields: {
            organizationId: "companyId",
            email: "email",
            role: "role",
            status: "status",
            expiresAt: "expiresAt",
            inviterId: "inviterId",
          },
        },
      },
    }),
    customSession(async ({ user, session }) => {
      // Primeiro, tenta buscar na tabela usersToCompanyTable (usuários que criaram empresas)
      const ownedCompanies = await db.query.usersToCompanyTable.findMany({
        where: eq(schema.usersToCompanyTable.userId, user.id as string),
        with: {
          company: true,
        },
      });

      // Se não encontrou, busca na tabela member (usuários adicionados a empresas)
      let company = ownedCompanies?.[0];

      if (!company) {
        const memberCompanies = await db.query.member.findMany({
          where: eq(schema.member.userId, user.id as string),
          with: {
            company: true,
          },
        });

        if (memberCompanies?.[0]) {
          // Adapta o formato para ser compatível com a estrutura esperada
          company = {
            userId: user.id as string,
            companyId: memberCompanies[0].companyId,
            company: memberCompanies[0].company,
            createdAt: memberCompanies[0].createdAt,
            updatedAt: new Date(),
          };
        }
      }

      return {
        user: {
          ...user,
          company: company?.companyId
            ? {
                id: company?.companyId,
                name: company?.company?.name,
              }
            : undefined,
        },
        session,
      };
    }),
  ],
  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});
