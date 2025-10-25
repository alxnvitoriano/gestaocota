import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface CompanyInvitationEmailProps {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  CompanyName: string;
  inviteLink: string;
}

const CompanyInvitationEmail = (props: CompanyInvitationEmailProps) => {
  const { email, invitedByUsername, invitedByEmail, CompanyName, inviteLink } =
    props;

  return (
    <Html lang="pt" dir="ltr">
      <Head />
      <Preview>Você foi convidado para se juntar ao time {CompanyName}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[16px] text-[28px] font-bold text-gray-900">
                Convite para o Time
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                Você foi convidado para se juntar ao time {CompanyName}!
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="mb-[16px] text-[18px] font-semibold text-gray-900">
                Olá!
              </Text>

              <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-700">
                <strong>{invitedByUsername}</strong> ({invitedByEmail}) convidou
                você para se juntar ao time <strong>{CompanyName}</strong>.
              </Text>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Ao aceitar este convite, você terá acesso completo às
                ferramentas e recursos da equipe, podendo colaborar em projetos
                e participar de todas as atividades do time.
              </Text>

              {/* CTA Button */}
              <Section className="mb-[32px] text-center">
                <Button
                  href={inviteLink}
                  className="box-border inline-block rounded-[8px] bg-blue-600 px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
                >
                  Aceitar Convite
                </Button>
              </Section>

              <Text className="mb-[16px] text-[14px] leading-[20px] text-gray-600">
                Se o botão não funcionar, você pode copiar e colar o link abaixo
                no seu navegador:
              </Text>

              <Text className="mb-[24px] text-[14px] break-all text-blue-600">
                {inviteLink}
              </Text>
            </Section>

            <Hr className="my-[24px] border-gray-200" />

            {/* Additional Info */}
            <Section className="mb-[24px]">
              <Text className="mb-[12px] text-[14px] leading-[20px] text-gray-600">
                <strong>Detalhes do convite:</strong>
              </Text>
              <Text className="mb-[8px] text-[14px] text-gray-600">
                • <strong>Email convidado:</strong> {email}
              </Text>
              <Text className="mb-[8px] text-[14px] text-gray-600">
                • <strong>Time:</strong> {CompanyName}
              </Text>
              <Text className="mb-[16px] text-[14px] text-gray-600">
                • <strong>Convidado por:</strong> {invitedByUsername}
              </Text>
            </Section>

            <Hr className="my-[24px] border-gray-200" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="mb-[8px] text-[12px] text-gray-500">
                Este convite foi enviado para {email}
              </Text>
              <Text className="mb-[8px] text-[12px] text-gray-500">
                Se você não esperava receber este convite, pode ignorar este
                email.
              </Text>
              <Text className="m-0 text-[12px] text-gray-500">
                © 2024 {CompanyName}. Todos os direitos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CompanyInvitationEmail;
