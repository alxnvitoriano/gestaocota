import React from "react";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full space-y-4 p-4 sm:space-y-6 sm:p-6">{children}</div>
  );
};

export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
};

export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full space-y-1">{children}</div>;
};

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-xl font-bold sm:text-2xl">{children}</h1>;
};

export const PageDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-muted-foreground text-xs sm:text-sm">{children}</p>;
};

export const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6">{children}</div>;
};

export const PageActions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">{children}</div>
  );
};
