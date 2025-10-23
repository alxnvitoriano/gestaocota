"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    company: "Tech Corp",
    status: "Active",
    value: "$45,000",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@startup.io",
    company: "Startup Inc",
    status: "Lead",
    value: "$32,000",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@enterprise.com",
    company: "Enterprise Ltd",
    status: "Active",
    value: "$78,000",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.k@business.net",
    company: "Business Co",
    status: "Inactive",
    value: "$12,000",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "l.anderson@solutions.com",
    company: "Solutions Group",
    status: "Lead",
    value: "$56,000",
  },
];

export function ContactsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contacts</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contact.status === "Active"
                        ? "default"
                        : contact.status === "Lead"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{contact.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
