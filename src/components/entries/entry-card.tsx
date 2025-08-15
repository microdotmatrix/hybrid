"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import { deleteEntry } from "@/lib/actions/entries";
import { Entry } from "@/lib/db/schema";
import { 
  FileText, 
  Image, 
  Edit3, 
  Trash2, 
  Calendar,
  MapPin 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface EntryCardProps {
  entry: Entry;
  onDelete?: () => void;
}

export const EntryCard = ({ entry, onDelete }: EntryCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteEntry(entry.id);
        if (result.success) {
          toast.success("Entry deleted successfully");
          onDelete?.();
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete entry");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const lifespan = () => {
    if (!entry.dateOfBirth && !entry.dateOfDeath) return null;
    const birth = entry.dateOfBirth ? new Date(entry.dateOfBirth).getFullYear() : '?';
    const death = entry.dateOfDeath ? new Date(entry.dateOfDeath).getFullYear() : '?';
    return `${birth} - ${death}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Left side - Avatar/Image */}
          <div className="flex-shrink-0">
            <Avatar className="w-20 h-20 border-2 border-muted">
              <AvatarImage src={entry.imageUrl || ""} alt={entry.name} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(entry.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {entry.name}
                </h3>
                {lifespan() && (
                  <Badge variant="secondary" className="mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {lifespan()}
                  </Badge>
                )}
              </div>
            </div>

            {/* Location information */}
            <div className="space-y-1 mb-4 text-sm text-muted-foreground">
              {entry.birthLocation && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Born: {entry.birthLocation}</span>
                </div>
              )}
              {entry.deathLocation && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Died: {entry.deathLocation}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => router.push(`/entries/${entry.id}/obituary`)}
              >
                <FileText className="w-3 h-3" />
                Obituaries
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => router.push(`/entries/${entry.id}/images`)}
              >
                <Image className="w-3 h-3" />
                Images
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => router.push(`/entries/${entry.id}/edit`)}
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    disabled={isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Memorial Entry</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the memorial entry for <strong>{entry.name}</strong>? 
                      This action cannot be undone and will also delete any associated obituary details.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isPending ? "Deleting..." : "Delete Entry"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
