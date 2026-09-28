"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DragEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";

export function useProductCarousel(itemCount: number, selection: number) {
  const railRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);
  const interaction = useRef({ hover: false, focus: false, until: 0 });
  const drag = useRef<{
    id: number;
    x: number;
    scroll: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  function move(direction: number) {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.children[0] as HTMLElement | undefined;
    const second = rail.children[1] as HTMLElement | undefined;
    if (!first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    const max = rail.scrollWidth - rail.clientWidth;
    if (max <= 1 || step <= 0) return;
    const atEnd = rail.scrollLeft >= max - 2;
    const atStart = rail.scrollLeft <= 2;
    const left =
      direction > 0
        ? atEnd
          ? 0
          : Math.min(max, (Math.round(rail.scrollLeft / step) + 1) * step)
        : atStart
          ? max
          : Math.max(0, (Math.round(rail.scrollLeft / step) - 1) * step);
    rail.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || itemCount < 2 || !playing) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    observer.observe(rail);
    const timer = window.setInterval(() => {
      if (
        !visible ||
        document.hidden ||
        motion.matches ||
        interaction.current.hover ||
        interaction.current.focus ||
        drag.current ||
        Date.now() < interaction.current.until
      )
        return;
      move(1);
    }, 3500);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [playing, itemCount, selection]);

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    setDragging(false);
    interaction.current.until = Date.now() + 5000;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return {
    railRef,
    reset: () => {
      if (railRef.current) railRef.current.scrollLeft = 0;
    },
    dragging,
    playing,
    togglePlaying: () => setPlaying((value) => !value),
    move: (direction: number) => {
      interaction.current.until = Date.now() + 5000;
      move(direction);
    },
    interactionProps: {
      onMouseEnter: () => {
        interaction.current.hover = true;
      },
      onMouseLeave: () => {
        interaction.current.hover = false;
      },
      onFocusCapture: () => {
        interaction.current.focus = true;
      },
      onBlurCapture: (event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          interaction.current.focus = false;
      },
    },
    railProps: {
      onDragStart: (event: DragEvent<HTMLDivElement>) => event.preventDefault(),
      onWheel: () => {
        interaction.current.until = Date.now() + 5000;
      },
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        suppressClick.current = false;
        interaction.current.until = Date.now() + 5000;
        if (
          event.pointerType !== "mouse" ||
          event.button !== 0 ||
          (event.target as HTMLElement).closest("button")
        )
          return;
        drag.current = {
          id: event.pointerId,
          x: event.clientX,
          scroll: event.currentTarget.scrollLeft,
          moved: false,
        };
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        const start = drag.current;
        if (!start || start.id !== event.pointerId) return;
        const distance = event.clientX - start.x;
        if (!start.moved && Math.abs(distance) < 6) return;
        if (!start.moved) {
          start.moved = true;
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        event.currentTarget.scrollLeft = start.scroll - distance;
      },
      onPointerUp: finishDrag,
      onPointerLeave: (event: PointerEvent<HTMLDivElement>) => {
        if (!drag.current?.moved) finishDrag(event);
      },
      onPointerCancel: finishDrag,
      onLostPointerCapture: finishDrag,
      onClickCapture: (event: MouseEvent<HTMLDivElement>) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      },
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      },
    },
  };
}
