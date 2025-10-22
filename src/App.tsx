import { useState, useCallback } from 'react';
import CosmosBackground from './components/CosmosBackground';
import Note from './components/Note';
import ArrowCanvas from './components/ArrowCanvas';
import { Note as NoteType, Arrow } from './types';

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    fromNoteId: string | null;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Track mouse position for cosmos effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Normalize mouse position to -1 to 1 range
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });

    // Update drag state if dragging
    if (dragState?.isDragging) {
      setDragState({
        ...dragState,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    }
  }, [dragState]);

  // Create a new note on single click
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't create note if clicking on an existing note
    const target = e.target as HTMLElement;
    if (target.closest('[data-note]')) {
      return;
    }

    // Don't create note if we just finished dragging
    if (dragState?.isDragging) {
      return;
    }

    const newNote: NoteType = {
      id: `note-${Date.now()}-${Math.random()}`,
      x: e.clientX,
      y: e.clientY,
      text: '',
    };

    setNotes((prev) => [...prev, newNote]);
    setSelectedNoteId(newNote.id);
  }, [dragState]);

  // Start dragging from a note to create an arrow
  const handleDragStart = useCallback((noteId: string, x: number, y: number) => {
    setSelectedNoteId(noteId);
    setDragState({
      isDragging: true,
      fromNoteId: noteId,
      currentX: x,
      currentY: y,
    });
  }, []);

  // End drag and create arrow + new note
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState?.isDragging || !dragState.fromNoteId) return;

    // Create a new note at the end position
    const newNote: NoteType = {
      id: `note-${Date.now()}-${Math.random()}`,
      x: e.clientX,
      y: e.clientY,
      text: '',
    };

    // Create an arrow connecting the two notes
    const newArrow: Arrow = {
      id: `arrow-${Date.now()}-${Math.random()}`,
      fromNoteId: dragState.fromNoteId,
      toNoteId: newNote.id,
    };

    setNotes((prev) => [...prev, newNote]);
    setArrows((prev) => [...prev, newArrow]);
    setDragState(null);
    setSelectedNoteId(newNote.id);
  }, [dragState]);

  // Update note text
  const handleNoteTextChange = useCallback((noteId: string, text: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, text } : note))
    );
  }, []);

  // Handle key down on note
  const handleNoteKeyDown = useCallback((_noteId: string, _key: string) => {
    // Can be used for keyboard shortcuts in the future
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
    >
      {/* Cosmos background */}
      <CosmosBackground mousePosition={mousePosition} />

      {/* Arrow canvas */}
      <ArrowCanvas notes={notes} arrows={arrows} dragState={dragState} />

      {/* Notes layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        {notes.map((note) => (
          <div
            key={note.id}
            data-note
            style={{
              pointerEvents: 'auto',
            }}
          >
            <Note
              id={note.id}
              x={note.x}
              y={note.y}
              text={note.text}
              onTextChange={handleNoteTextChange}
              onDragStart={handleDragStart}
              onNoteKeyDown={handleNoteKeyDown}
              isSelected={note.id === selectedNoteId}
            />
          </div>
        ))}
      </div>

      {/* Instructions overlay */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <div>Click to create a note • Drag from a note to create a connection</div>
        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
          Press Enter to edit • Move your mouse to swirl the cosmos
        </div>
      </div>
    </div>
  );
}
