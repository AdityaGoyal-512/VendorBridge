import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Plus,
  Search,
  FileText,
  MoreHorizontal,
} from "lucide-react";

export default function RFQs() {
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/rfqs"
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setRfqs(data);
      } else if (data.data) {
        setRfqs(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredRFQs = useMemo(() => {
    return rfqs.filter(
      (rfq) =>
        rfq.title?.toLowerCase().includes(search.toLowerCase()) ||
        rfq.productName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [rfqs, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Requests for Quotation
          </h1>

          <p className="text-muted-foreground">
            Manage RFQs and procurement requests.
          </p>
        </div>

        <Button
          onClick={() => navigate("/rfqs/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create RFQ
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b p-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search RFQs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-md py-2 pl-10 pr-4"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRFQs.map((rfq) => (
                <TableRow key={rfq._id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {rfq.title}
                  </TableCell>

                  <TableCell>
                    {rfq.productName}
                  </TableCell>

                  <TableCell>
                    {rfq.quantity}
                  </TableCell>

                  <TableCell>
                    ₹{rfq.estimatedBudget}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {rfq.priority}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge>
                      {rfq.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(
                      rfq.deadline
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}