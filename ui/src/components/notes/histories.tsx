import { useCallback, useEffect, useState } from "react";
import { fetchVersions, updateNote } from "@/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { History, Undo2 } from 'lucide-react';
import { format } from "date-fns";
import { Note, NoteVersion } from "@/components/notes/types.ts";
import ReactDiffViewer from 'react-diff-viewer-continued';
import { ReloadIcon } from "@radix-ui/react-icons";

interface HistoryProps {
  note: Note,
  onChanged: (note: Note) => void,
}

interface Diff {
  oldValue: string;
  newValue: string;
}

export default function Histories({note, onChanged}: HistoryProps) {
  const {toast} = useToast();
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null);
  const [diff, setDiff] = useState<Diff>({} as Diff);
  const [loading, setLoading] = useState(false);
  const [state, updateState] = useState(0);
  const forceUpdate = useCallback(() => updateState(value => value + 1), []);

  useEffect(() => {
    fetchVersions(note.id).then((data) => {
      setVersions(data);
      setSelectedVersion(data[0]);
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Some error occurred",
        description: "Failed to fetch note histories, please try again later.",
      })
    });
  }, [state])

  useEffect(() => {
    if (selectedVersion) {
      const idx = versions.findIndex(version => version.id === selectedVersion.id);
      const prevVersion = versions[idx + 1];

      const oldValue =
        `
title: 
${ prevVersion?.title || '' }

content: 
${ prevVersion?.content || '' }
`;

      const newValue =
        `
title: 
${ selectedVersion.title }

content: 
${ selectedVersion.content }
`;

      setDiff({
        oldValue,
        newValue
      });
    }
  }, [selectedVersion]);

  const setNoteToVersion = async (version: NoteVersion) => {
    setLoading(true);

    try {
      const response = await updateNote(note.id, {
        title: version.title,
        content: version.content,
      });

      toast({
        title: "Note updated",
        description: "Note has been reverted successfully.",
      })

      onChanged(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Some error occurred",
        description: "Failed to revert note, please try again later.",
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <History onClick={ forceUpdate } className="cursor-pointer h-4 w-4"/>
      </DialogTrigger>
      <DialogContent className="w-full max-w-6xl">
        <DialogHeader>
          <DialogTitle>Note history</DialogTitle>
          <DialogDescription>
            List of all versions of this note
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <ul className="p-2 border-r border-gray-300" style={ {width: "250px"} }>
            { versions.map((version, index) =>
              <li className="flex justify-start items-center gap-2 pb-2" key={ index }
                  onClick={ () => setSelectedVersion(version) }>
                <div className="cursor-pointer">{ format(new Date(version.created_at), "yyyy-MM-dd HH:mm") }</div>
                <Undo2 className="cursor-pointer h-4 w-4" onClick={ () => setNoteToVersion(version) }/>
              </li>)
            }
          </ul>
          <div className="p-2 h-full w-full">
            <ReactDiffViewer oldValue={ diff?.oldValue } newValue={ diff?.newValue } splitView={ true }/>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          { loading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
          ) }
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}