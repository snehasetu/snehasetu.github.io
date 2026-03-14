import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { parseJson } from "@/lib/api";
import { Shield, UserCheck, UserX, RefreshCw } from "lucide-react";

const getApiBase = () => import.meta.env.VITE_API_URL || '';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('snehasetu_token');
      const base = getApiBase();
      const res = await fetch(`${base}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load users');
      const data = await parseJson<AdminUser[]>(res);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to load users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setApproved = async (userId: string, approved: boolean) => {
    try {
      const token = localStorage.getItem('snehasetu_token');
      const base = getApiBase();
      const res = await fetch(`${base}/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast({ title: approved ? 'Approved' : 'Unapproved', description: 'User updated.' });
      fetchUsers();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update', variant: 'destructive' });
    }
  };

  const setRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem('snehasetu_token');
      const base = getApiBase();
      const res = await fetch(`${base}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast({ title: 'Role updated', description: `User is now ${role}.` });
      fetchUsers();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update role', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <p className="text-sm text-muted-foreground">Manage roles and approve Old Age Home accounts.</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground py-8 text-center">Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <select
                            className="border rounded px-2 py-1 text-sm bg-background"
                            value={u.role}
                            onChange={(e) => setRole(u.id, e.target.value)}
                          >
                            <option value="volunteer">Volunteer</option>
                            <option value="oah">OAH</option>
                            <option value="admin">Admin</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {u.role === 'oah' ? (
                            u.approved ? (
                              <Badge variant="secondary">Approved</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.role === 'oah' && (
                            <>
                              {u.approved ? (
                                <Button size="sm" variant="outline" onClick={() => setApproved(u.id, false)}>
                                  <UserX className="h-4 w-4 mr-1" />
                                  Unapprove
                                </Button>
                              ) : (
                                <Button size="sm" onClick={() => setApproved(u.id, true)}>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {!loading && users.length === 0 && (
                <p className="text-muted-foreground py-8 text-center">No users yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
