import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEntryForm } from "@/components/entries/create-entry-form";
import { EntryCard } from "@/components/entries/entry-card";
import { getUserEntries } from "@/lib/actions/entries";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/auth/actions";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const entries = await getUserEntries();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-7xl py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Welcome{session.user.name ? `, ${session.user.name}` : ""}
              </span>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </CardTitle>
          </CardHeader>
          {entries.length > 0 && (
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>You have {entries.length} memorial {entries.length === 1 ? 'entry' : 'entries'}</p>
                </div>
                <Button asChild className="flex items-center gap-2">
                  <a href="/entries/new">
                    <Plus className="w-4 h-4" />
                    Create New Entry
                  </a>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Main content */}
        {entries.length === 0 ? (
          /* Show form when no entries */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Create Your First Memorial Entry
              </h2>
              <p className="text-muted-foreground max-w-md">
                Start by creating a memorial entry for someone you'd like to honor. 
                You can then generate personalized obituaries and manage their legacy.
              </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <CreateEntryForm />
            </Suspense>
          </div>
        ) : (
          /* Show entries in kanban style */
          <div className="space-y-6">
            {/* Most recent entry - featured */}
            {entries.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Most Recent
                </h2>
                <div className="max-w-2xl">
                  <EntryCard 
                    entry={entries[0]} 
                    onDelete={() => window.location.reload()} 
                  />
                </div>
              </div>
            )}

            {/* Previous entries - grid layout */}
            {entries.length > 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Previous Entries
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {entries.slice(1).map((entry) => (
                    <EntryCard 
                      key={entry.id} 
                      entry={entry}
                      onDelete={() => window.location.reload()} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
