import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, Admin!</h2>
      <p className="text-muted-foreground mb-8">
        Manage your store from this central dashboard.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard/sweets">
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sweets Management
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                Add, edit, or delete sweets from your inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Package className="h-12 w-12 text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
