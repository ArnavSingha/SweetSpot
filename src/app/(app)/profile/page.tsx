import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/server/auth';
import { getPurchasesByUserId, getSweetById } from '@/lib/data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const purchases = await getPurchasesByUserId(user.id);
  const purchaseDetails = await Promise.all(
    purchases.map(async (p) => {
      const sweet = await getSweetById(p.sweetId);
      return { ...p, sweetName: sweet?.name || 'Unknown Sweet' };
    })
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-3xl">
            {user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.email}</h1>
          <Badge className="mt-1">{user.role}</Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseDetails.length > 0 ? (
                purchaseDetails.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.sweetName}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>Rs.{p.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(p.purchaseDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    You have not made any purchases yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
