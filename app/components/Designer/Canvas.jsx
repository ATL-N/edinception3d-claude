"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Canvas({
  garmentColor = "#4a90e2",
  garmentOptions = {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update canvas dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Draw the garment on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling factor to fit the dress into the canvas
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scale = Math.min(canvasWidth / 500, canvasHeight / 600) * 0.8;

    // Center the dress on canvas
    const offsetX = canvasWidth / 2;
    const offsetY = canvasHeight / 6;

    // Apply scaling and centering
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw the dress based on options
    drawDress(ctx, garmentColor, garmentOptions);

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [garmentColor, garmentOptions, dimensions]);

  // Draw the dress based on options
  function drawDress(ctx, color, options) {
    // Set dress color
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    // Draw dress body
    ctx.beginPath();
    ctx.moveTo(-100, 0); // Start at left shoulder

    // Draw neckline
    const necklineType = options.neckline || "scoop";
    if (necklineType === "scoop") {
      ctx.bezierCurveTo(-80, -20, 80, -20, 100, 0); // Scoop neck
    } else if (necklineType === "v-neck") {
      ctx.lineTo(0, 50); // V-neck
      ctx.lineTo(100, 0);
    } else {
      ctx.lineTo(100, 0); // Straight neckline
    }

    // Draw right side
    ctx.lineTo(150, 400); // Right hem

    // Draw bottom hem
    if (options.hemStyle === "flared") {
      ctx.bezierCurveTo(100, 450, -100, 450, -150, 400); // Flared hem
    } else {
      ctx.lineTo(-150, 400); // Straight hem
    }

    // Draw left side back to shoulder
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw sleeve type
    const sleeveType = options.sleeves || "sleeveless";
    if (sleeveType === "3/4-fitted-sleeves") {
      // Left sleeve
      ctx.beginPath();
      ctx.moveTo(-100, 0);
      ctx.lineTo(-180, 200);
      ctx.lineTo(-150, 220);
      ctx.lineTo(-80, 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right sleeve
      ctx.beginPath();
      ctx.moveTo(100, 0);
      ctx.lineTo(180, 200);
      ctx.lineTo(150, 220);
      ctx.lineTo(80, 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (sleeveType === "short-sleeves") {
      // Left sleeve
      ctx.beginPath();
      ctx.moveTo(-100, 0);
      ctx.lineTo(-150, 80);
      ctx.lineTo(-120, 100);
      ctx.lineTo(-80, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right sleeve
      ctx.beginPath();
      ctx.moveTo(100, 0);
      ctx.lineTo(150, 80);
      ctx.lineTo(120, 100);
      ctx.lineTo(80, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw waist detail
    if (options.waistSeam) {
      ctx.beginPath();
      ctx.moveTo(-100, 150);
      ctx.lineTo(100, 150);
      ctx.stroke();
    }

    // Draw ruffles at bottom if selected
    if (options.ruffleStyle === "double-ruffle") {
      drawRuffles(ctx, -150, 400, 150, 400, 2);
    } else if (options.ruffleStyle === "flounce") {
      drawRuffles(ctx, -150, 400, 150, 400, 1);
    }
  }

  // Function to draw ruffles
  function drawRuffles(ctx, startX, startY, endX, endY, layers) {
    const ruffleHeight = 40;

    for (let layer = 0; layer < layers; layer++) {
      const offsetY = layer * ruffleHeight;
      ctx.beginPath();
      ctx.moveTo(startX, startY + offsetY);

      // Draw a wavy line for ruffles
      const steps = 20;
      const stepSize = (endX - startX) / steps;
      for (let i = 0; i <= steps; i++) {
        const x = startX + i * stepSize;
        const y = startY + offsetY + Math.sin(i * 0.5) * 15;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  return (
    <div
      ref={containerRef}
      className="model-viewer"
      style={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: "block" }}
      />
    </div>
  );
}
