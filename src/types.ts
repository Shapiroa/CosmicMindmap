export interface Note {
  id: string;
  x: number;
  y: number;
  text: string;
}

export interface Arrow {
  id: string;
  fromNoteId: string;
  toNoteId: string;
}
