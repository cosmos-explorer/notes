import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { deleteNote } from "@/api";
import { Note as NoteType } from "@/components/notes/types";
import Edit from "@/components/notes/edit.tsx";
import { Trash2 } from "lucide-react";
import Histories from "@/components/notes/histories.tsx";


export default function Note({note, onDeleted, onChanged}: {
  note: NoteType,
  onDeleted: (id: number) => void,
  onChanged: (note: NoteType) => void
}) {
  const {id, title, content, created_at} = note;
  const createdAt = format(new Date(created_at), "yyyy-MM-dd HH:mm");

  const handleDelete = async () => {
    try {
      await deleteNote(id);
      onDeleted(id);
      toast({
        title: "Note deleted",
        description: "Note has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Some error occurred",
        description: "Failed to delete note, please try again later.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>{ title }</div>
          <div className="flex gap-5">
            <Histories note={ note } onChanged={ onChanged }/>
            <Edit note={ note } onSaved={ onChanged }/>
            <Trash2 className="cursor-pointer h-4 w-4" onClick={ handleDelete }/>
          </div>
        </CardTitle>
        <CardDescription>{ createdAt }</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            { content }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}