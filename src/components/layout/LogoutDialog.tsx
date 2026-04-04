"use client"

import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAppContext } from "@/context/AppContext"

interface LogoutDialogProps {
  children: React.ReactNode
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const { logout } = useAppContext()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl border-slate-200 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black text-primary tracking-tight">
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 font-medium">
            Are you sure you want to log out of FixIt? You will need to sign in again to report issues or access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-all">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={logout}
            className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 transition-all"
          >
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
