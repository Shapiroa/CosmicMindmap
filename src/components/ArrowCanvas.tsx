import { useEffect, useRef } from 'react';
import { Note, Arrow } from '../types';

interface ArrowCanvasProps {
  notes: Note[];
  arrows: Arrow[];
  dragState: {
    isDragging: boolean;
    fromNoteId: string | null;
    currentX: number;
    currentY: number;
  } | null;
}

export default function ArrowCanvas({ notes, arrows, dragState }: ArrowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing arrows
    arrows.forEach((arrow) => {
      const fromNote = notes.find((n) => n.id === arrow.fromNoteId);
      const toNote = notes.find((n) => n.id === arrow.toNoteId);

      if (fromNote && toNote) {
        drawArrow(ctx, fromNote.x, fromNote.y, toNote.x, toNote.y, 'rgba(138, 43, 226, 0.8)');
      }
    });

    // Draw temporary arrow while dragging
    if (dragState?.isDragging && dragState.fromNoteId) {
      const fromNote = notes.find((n) => n.id === dragState.fromNoteId);
      if (fromNote) {
        drawArrow(
          ctx,
          fromNote.x,
          fromNote.y,
          dragState.currentX,
          dragState.currentY,
          'rgba(255, 255, 255, 0.6)',
          true
        );
      }
    }
  }, [notes, arrows, dragState]);

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    isDashed = false
  ) => {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    if (isDashed) {
      ctx.setLineDash([8, 8]);
    } else {
      ctx.setLineDash([]);
    }

    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}
