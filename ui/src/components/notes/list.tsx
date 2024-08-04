import { useToast } from "@/components/ui/use-toast.ts";
import { useCallback, useEffect, useState } from "react";
import { fetchNotes } from "@/api";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import debounce from "lodash.debounce";
import NoteComponent from "@/components/notes/note";
import Create from "@/components/notes/create.tsx";
import { Note } from "@/components/notes/types";

export default function List() {
  const {toast} = useToast()
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState([]);


  const handleSearch = async () => {
    const filter = {title: query};
    try {
      const notes = await fetchNotes(filter);
      setNotes(notes);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Some error occurred",
        description: "Failed to fetch notes, please try again later.",
      })
    }
  }

  useEffect(() => {
    handleSearch().then();
  }, []);

  const debouncedHandleSearch = useCallback(
    debounce(() => {
      handleSearch();
    }, 300),
    []
  );

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    debouncedHandleSearch(newQuery);
  };

  const onDeleted = (id) => {
    const result = notes.filter((note) => note.id !== id);
    setNotes(result);
  }

  const onCreated = (note: Note) => {
    setNotes([note, ...notes]);
  }

  const onChanged = (note: Note) => {
    setNotes(notes.map(item => {
      if (item.id === note.id) {
        return {...note}
      }

      return item;
    }))
  }
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="relative m-auto w-1/2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={ query }
            onChange={ handleChange }
          />
        </div>
        <Create onSaved={ onCreated }/>
      </div>
      {
        notes.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            { notes.map((note, index) => <NoteComponent key={ index } note={ note }
                                                        onDeleted={ onDeleted }
                                                        onChanged={ onChanged }/>) }
          </div>
        ) : (
          <div className="mt-20 flex justify-center w-full text-gray-400 font-semibold">You don't have any notes
            yet</div>
        )
      }
    </div>
  )
}