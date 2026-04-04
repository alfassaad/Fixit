"use client";

import { useEffect, useState } from 'react';
import { 
  Users, Search, Filter, MoreVertical, 
  ShieldCheck, UserCheck, ShieldAlert, Mail, MapPin, Loader2, CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    
    if (error) {
      toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `User promoted to ${newRole}` });
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">User Directory</h1>
          <p className="text-muted-foreground mt-1">Manage platform access, roles, and department assignments</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-bold rounded-xl h-11 border-slate-200">Export CSV</Button>
           <Button className="bg-primary font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">Invite User</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name, email or department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 border-slate-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-primary transition-all font-medium"
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 bg-white flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-left text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-8 py-5">User Identity</th>
                  <th className="px-6 py-5">Credentials / Role</th>
                  <th className="px-6 py-5">Department</th>
                  <th className="px-6 py-5">Account Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 italic-none">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300" />
                       <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">Synchronizing Directory...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border transition-transform group-hover:scale-110",
                             user.role === 'admin' ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20"
                          )}>
                             {user.full_name?.[0].toUpperCase() || 'U'}
                          </div>
                          <div className="space-y-0.5">
                            <div className="font-bold text-primary text-base flex items-center gap-2">
                               {user.full_name || 'Anonymous User'}
                               {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-primary" />}
                            </div>
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate max-w-[150px]">
                               <Mail className="w-3 h-3" /> {user.email || 'No email synced'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             user.role === 'admin' ? "text-primary" : user.role === 'technician' ? "text-accent" : "text-slate-400"
                          )}>{user.role || 'Citizen'}</span>
                          <span className="text-xs font-bold text-slate-500">ID: {user.user_id.slice(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                           <span className="text-sm font-bold text-slate-600 truncate">{user.department || 'General Public'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={cn(
                          "rounded-full capitalize px-3 py-1 text-[10px] font-black border-none ring-1 ring-inset",
                          user.status !== 'suspended' 
                             ? "bg-green-50 text-green-700 ring-green-100" 
                             : "bg-red-50 text-red-700 ring-red-100"
                        )}>
                          {user.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                              <MoreVertical size={18} className="text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                            <DropdownMenuItem className="p-3 flex items-center gap-3 font-bold text-slate-600 rounded-xl cursor-pointer">
                               <UserCheck className="w-4 h-4" /> View Full Profile
                            </DropdownMenuItem>
                            
                            {user.role !== 'admin' && (
                               <DropdownMenuItem 
                                 onClick={() => handleUpdateRole(user.user_id, 'admin')}
                                 className="p-3 flex items-center gap-3 font-bold text-primary rounded-xl cursor-pointer"
                               >
                                  <ShieldCheck className="w-4 h-4" /> Make Administrator
                               </DropdownMenuItem>
                            )}

                            {user.role !== 'technician' && (
                               <DropdownMenuItem 
                                 onClick={() => handleUpdateRole(user.user_id, 'technician')}
                                 className="p-3 flex items-center gap-3 font-bold text-accent rounded-xl cursor-pointer"
                               >
                                  <UserCheck className="w-4 h-4" /> Assign Technician Role
                               </DropdownMenuItem>
                            )}

                            <div className="h-px bg-slate-50 my-1" />
                            <DropdownMenuItem className="p-3 flex items-center gap-3 font-bold text-red-600 rounded-xl cursor-pointer">
                               <ShieldAlert className="w-4 h-4" /> Terminate Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No users found matching your search</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {!loading && users.length > 0 && (
        <div className="flex justify-between items-center px-4">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} registered users</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg font-bold" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="rounded-lg font-bold" disabled>Next</Button>
           </div>
        </div>
      )}
    </div>
  );
}
