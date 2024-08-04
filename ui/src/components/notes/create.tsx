import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/api";
import { toast } from "@/components/ui/use-toast";
import { Note } from "@/components/notes/types";
import { z } from "zod";
import { useState } from "react";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export default function Create({onSaved}: { onSaved: (note: Note) => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async () => {
    const result = noteSchema.safeParse({title, content});
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: result.error.errors.map((err) => err.message).join(", "),
      });
      return;
    }

    setLoading(true);

    try {
      const response = await createNote({
        title: result.data.title,
        content: result.data.content,
      });
      toast({
        title: "Note created",
        description: "Note has been created successfully.",
      })

      setIsOpen(false);
      onSaved(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Some error occurred",
        description: "Failed to create note, please try again later.",
      })
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-5 w-5"/>
          New Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
          <DialogDescription>
            Create a new note.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="title"
              placeholder="Note title"
              value={ title }
              onChange={ (e) => setTitle(e.target.value) }
            />
            <Textarea
              placeholder="Content..."
              className="min-h-[400px] flex-1 p-4 md:min-h-[400px] lg:min-h-[400px]"
              value={ content }
              onChange={ (e) => setContent(e.target.value) }
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={ handleCreate } disabled={ loading }>
            { loading ? "Saving..." : "Save" }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}