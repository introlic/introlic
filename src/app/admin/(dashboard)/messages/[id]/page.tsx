import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";
import Link from "next/link";
import MessageDetailClient from "./MessageDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MessageDetailPage({ params }: PageProps) {
  const session = await getAdminSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1);

  if (!contact) {
    return (
      <main className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md space-y-4 animate-fadeIn">
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Message Not Found</h1>
          <p className="text-gray-500 text-xs leading-relaxed">
            The requested contact message could not be found in the database.
          </p>
          <Link href="/admin/messages" className="inline-block px-5 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all">
            Return to Messages
          </Link>
        </div>
      </main>
    );
  }

  return (
    <MessageDetailClient contact={contact} />
  );
}
