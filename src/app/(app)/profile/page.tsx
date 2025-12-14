import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/server/auth';
import {
  getPurchasesByUserId,
  getSweetById,
  getAllPurchases,
  findUserById,
} from '@/lib/data';
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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const isAdmin = user.role === 'admin';
  const purchases = isAdmin
    ? await getAllPurchases()
    : await getPurchasesByUserId(user.id);

  const purchaseDetails = await Promise.all(
    purchases.map(async (p) => {
      const sweet = await getSweetById(p.sweetId);
      const customer = isAdmin ? await findUserById(p.userId) : null;
      return {
        ...p,
        sweetName: sweet?.name || 'Unknown Sweet',
        customerEmail: customer?.email || 'N/A',
      };
    })
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Link>
        </Button>
      </div>
      <header className="mb-8 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-3xl">
            {user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-headline text-3xl font-bold">{user.email}</h1>
          <Badge className="mt-1">{user.role}</Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>
            {isAdmin ? 'All User Purchase History' : 'Your Purchase History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>User</TableHead>}
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
                    {isAdmin && <TableCell>{p.customerEmail}</TableCell>}
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
                  <TableCell
                    colSpan={isAdmin ? 5 : 4}
                    className="text-center"
                  >
                    {isAdmin
                      ? 'No purchases have been made by any user yet.'
                      : 'You have not made any purchases yet.'}
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
