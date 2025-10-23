"use client";

import { Calendar, Mail, MessageSquare, Phone, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    type: "call",
    title: "Call with Sarah Johnson",
    description: "Discussed Q4 requirements and budget allocation",
    time: "2 hours ago",
    icon: Phone,
  },
  {
    id: 2,
    type: "email",
    title: "Email sent to Michael Chen",
    description: "Proposal for cloud migration project",
    time: "5 hours ago",
    icon: Mail,
  },
  {
    id: 3,
    type: "meeting",
    title: "Meeting with Enterprise Ltd",
    description: "Product demo and technical discussion",
    time: "Yesterday",
    icon: Calendar,
  },
  {
    id: 4,
    type: "note",
    title: "Note added to David Kim",
    description: "Follow up needed after vacation",
    time: "2 days ago",
    icon: MessageSquare,
  },
  {
    id: 5,
    type: "call",
    title: "Call with Lisa Anderson",
    description: "Contract negotiation and pricing discussion",
    time: "3 days ago",
    icon: Phone,
  },
];

export function ActivitiesTimeline() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activities</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <activity.icon className="text-primary h-5 w-5" />
                </div>
                {index < activities.length - 1 && (
                  <div className="bg-border mt-2 h-full w-px" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {activity.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {activity.time}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
