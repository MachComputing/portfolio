import { useEffect, useRef } from "react";

export function RenderCanvas({
  onUpdate,
  onInit,
}: {
  onUpdate: (delta: number) => void;
  onInit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef<boolean>(false);
  const prevFrameTime = useRef<number>(0);

  function update() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    onUpdate(performance.now() - prevFrameTime.current);
    requestAnimationFrame(update);
  }

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      prevFrameTime.current = performance.now();
      onInit();
      update();

      window.addEventListener("resize", () => {
        const canvas = canvasRef.current;
        if (canvas) {
          prevFrameTime.current = performance.now();
          onInit();
          update();
        }
      });
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="w-full h-screen" />;
}
