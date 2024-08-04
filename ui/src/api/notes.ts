import apiClient from './client';
import { toQueryString } from "@/lib/utils.ts";
import { Note, NoteVersion } from "@/components/notes/types";

export interface NoteFilter {
  title?: string;
}

export const fetchNotes = async (filter: NoteFilter): Promise<Note[]> => {
  const {title} = filter;

  const query = toQueryString({title});

  const response = await apiClient.get<Note[]>(`/notes${ query }`);
  return response.data;
};

export const createNote = async (noteData: { title: string; content: string }): Promise<Note> => {
  const response = await apiClient.post<Note>('/notes', noteData);
  return response.data;
};

export const updateNote = async (id: number, noteData: { title: string; content: string }): Promise<Note> => {
  const response = await apiClient.put(`/notes/${ id }`, noteData);
  return response.data
};

export const deleteNote = async (id: number): Promise<void> => {
  await apiClient.delete(`/notes/${ id }`);
};

export const fetchVersions = async (noteId: number): Promise<NoteVersion[]> => {
  const response = await apiClient.get<Note[]>(`/notes/${ noteId }/versions`);
  return response.data;
}
