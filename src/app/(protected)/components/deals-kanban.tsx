"use client";

import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  {
    title: "Prospecting",
    deals: [
      {
        id: 1,
        title: "Enterprise Software Deal",
        value: "$125,000",
        company: "Tech Corp",
      },
      {
        id: 2,
        title: "Cloud Migration",
        value: "$85,000",
        company: "Startup Inc",
      },
    ],
  },
  {
    title: "Qualification",
    deals: [
      {
        id: 3,
        title: "SaaS Platform",
        value: "$95,000",
        company: "Business Co",
      },
      {
        id: 4,
        title: "Consulting Services",
        value: "$45,000",
        company: "Solutions Group",
      },
    ],
  },
  {
    title: "Proposal",
    deals: [
      {
        id: 5,
        title: "Digital Transformation",
        value: "$210,000",
        company: "Enterprise Ltd",
      },
    ],
  },
  {
    title: "Negotiation",
    deals: [
      {
        id: 6,
        title: "API Integration",
        value: "$65,000",
        company: "Tech Startup",
      },
    ],
  },
];

export function DealsKanban() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Deals Pipeline</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <Card key={column.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{column.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {column.deals.length} deals
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {column.deals.map((deal) => (
                <Card
                  key={deal.id}
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-sm font-semibold">{deal.title}</h3>
                    <p className="text-muted-foreground mb-2 text-xs">
                      {deal.company}
                    </p>
                    <p className="text-accent text-sm font-bold">
                      {deal.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
