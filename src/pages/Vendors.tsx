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
  MoreHorizontal,
  Building2,
} from "lucide-react";

export default function Vendors() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/vendors"
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setVendors(data);
      } else if (data.data) {
        setVendors(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(
      (vendor) =>
        vendor.name?.toLowerCase().includes(search.toLowerCase()) ||
        vendor.category?.toLowerCase().includes(search.toLowerCase())
    );
  }, [vendors, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vendors
          </h1>
          <p className="text-muted-foreground">
            Manage all registered vendors.
          </p>
        </div>

        <Button
          onClick={() => navigate("/vendors/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b p-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search vendors..."
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
                <TableHead>Vendor</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {vendor.name}
                  </TableCell>

                  <TableCell>
                    {vendor.gstNumber}
                  </TableCell>

                  <TableCell>
                    {vendor.category}
                  </TableCell>

                  <TableCell>
                    {vendor.rating}
                  </TableCell>

                  <TableCell>
                    <Badge>
                      {vendor.status}
                    </Badge>
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