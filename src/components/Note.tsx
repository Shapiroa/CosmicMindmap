import { useState, useRef, useEffect } from 'react';

interface NoteProps {
  id: string;
  x: number;
  y: number;
  text: string;
  onTextChange: (id: string, text: string) => void;
  onDragStart: (id: string, x: number, y: number) => void;
  onNoteKeyDown: (id: string, key: string) => void;
  isSelected: boolean;
}

export default function Note({
  id,
  x,
  y,
  text,
  onTextChange,
  onDragStart,
  onNoteKeyDown,
  isSelected,
}: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Focus the note when selected
  useEffect(() => {
    if (isSelected && !isEditing && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isSelected, isEditing]);

  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }

    onNoteKeyDown(id, e.key);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange(id, localText);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      onTextChange(id, localText);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalText(text);
    }
    // Prevent event from bubbling to container
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation(); // Prevent click from creating new note

    // Only trigger drag start if clicking on the note itself, not when editing
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('note-content')) {
      onDragStart(id, e.clientX, e.clientY);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        minWidth: '120px',
        minHeight: '80px',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.95), rgba(75, 0, 130, 0.95))'
          : 'linear-gradient(135deg, rgba(100, 100, 255, 0.9), rgba(150, 100, 255, 0.85))',
        borderRadius: '12px',
        padding: '12px',
        cursor: isEditing ? 'text' : 'move',
        boxShadow: isSelected
          ? '0 8px 32px rgba(138, 43, 226, 0.4), 0 0 20px rgba(138, 43, 226, 0.3)'
          : '0 4px 20px rgba(100, 100, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.2s ease',
        zIndex: isSelected ? 1000 : 100,
        outline: 'none',
      }}
      onKeyDown={handleContainerKeyDown}
      onMouseDown={handleMouseDown}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleTextareaKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            minHeight: '60px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'none',
          }}
        />
      ) : (
        <div
          className="note-content"
          style={{
            color: 'white',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: '60px',
            userSelect: 'none',
          }}
        >
          {text || 'Press Enter to edit'}
        </div>
      )}
      {/* Drag handle indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
