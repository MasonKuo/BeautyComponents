"use client";

import { useEffect, useRef, useState } from "react";

const GooeyBackground = () => {
  const svgRef = useRef<any>(null);
  const [circleCount, setCircleCount] = useState(5);
  const [showControls, setShowControls] = useState(true);
  const [circles, setCircles] = useState<
    Array<{ color: string; speed: number; cx: number; cy: number; r: number }>
  >([]);

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = [
      "#ff0066",
      "#6600ff",
      "#00ff99",
      "#ff6600",
      "#00ccff",
      "#ff00ff",
      "#ffff00",
      "#00ff66",
      "#ff3399",
      "#33ccff",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 生成更好的初始位置分布
  const getInitialPositions = (count: number) => {
    const positions = [];
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      // 将圆形分布在视图的不同区域
      positions.push({
        cx: 50 + 30 * Math.cos(angle),
        cy: 50 + 30 * Math.sin(angle),
        r: 10 + Math.random() * 10, // 半径范围10-20
      });
    }
    return positions;
  };

  // 初始化或更新圆形
  useEffect(() => {
    const initialPositions = getInitialPositions(circleCount);
    const newCircles = Array.from({ length: circleCount }, (_, i) => ({
      color: getRandomColor(),
      speed: 0.005 + Math.random() * 0.02, // 更慢的速度
      ...initialPositions[i],
    }));
    setCircles(newCircles);
  }, [circleCount]);

  useEffect(() => {
    if (!svgRef.current || circles.length === 0) return;

    const svgCircles = svgRef.current.querySelectorAll("circle");
    const angles = Array(circles.length)
      .fill(0)
      .map(() => Math.random() * Math.PI * 2);
    const centerXs = circles.map((circle) => parseFloat(circle.cx.toString()));
    const centerYs = circles.map((circle) => parseFloat(circle.cy.toString()));
    const radii = circles.map((circle) => parseFloat(circle.r.toString()));

    const animate = () => {
      angles.forEach((angle, i) => {
        angle += circles[i].speed;
        angles[i] = angle;

        // 更复杂的运动模式
        const motionPattern = i % 5;
        let x = centerXs[i];
        let y = centerYs[i];

        switch (motionPattern) {
          case 0: // 椭圆轨迹
            x += radii[i] * 0.8 * Math.cos(angle * 0.8);
            y += radii[i] * 0.5 * Math.sin(angle * 1.2);
            break;
          case 1: // 8字形轨迹
            x += radii[i] * 0.6 * Math.sin(angle);
            y += radii[i] * 0.4 * Math.sin(angle * 2);
            break;
          case 2: // 圆形轨迹
            x += radii[i] * 0.7 * Math.cos(angle);
            y += radii[i] * 0.7 * Math.sin(angle);
            break;
          case 3: // 缓慢漂移
            x += radii[i] * 0.3 * Math.sin(angle * 0.5);
            y += radii[i] * 0.3 * Math.cos(angle * 0.5);
            break;
          case 4: // 螺旋效果
            const spiralFactor = 0.5 + angle * 0.01;
            x += radii[i] * spiralFactor * Math.cos(angle);
            y += radii[i] * spiralFactor * Math.sin(angle);
            break;
        }

        svgCircles[i].setAttribute("cx", x);
        svgCircles[i].setAttribute("cy", y);
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [circles]);

  return (
    <div className="relative w-full h-screen overflow-hidden p-4">
      {/* 背景SVG */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
        filter="url(#goo)"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 30 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>

        {circles.map((circle, index) => (
          <circle
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill={circle.color}
          />
        ))}
      </svg>

      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-transparent z-[1]" />

      {/* 内容区域 */}
      <div className="relative z-10">
        <h1 className="text-6xl font-bold mb-8 text-white drop-shadow-lg">
          优化后的粘性液体效果
        </h1>

        <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-3xl border border-white/10 max-w-xl">
          <p className="text-lg leading-relaxed mb-6">
            现在圆形重叠时的融合效果更加自然，运动轨迹也更流畅。
          </p>

          {/* 控制面板 */}
          <div className="mt-8 p-6 bg-black/30 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">控制面板</h2>
              <button
                onClick={() => setShowControls(!showControls)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-sm transition"
              >
                {showControls ? "隐藏" : "显示"}
              </button>
            </div>

            {showControls && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    圆形数量: {circleCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={circleCount}
                    onChange={(e) => setCircleCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {circles.map((circle, index) => (
                    <div
                      key={index}
                      className="h-8 rounded-md flex items-center justify-center text-xs"
                      style={{ backgroundColor: circle.color }}
                    >
                      #{index + 1}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCircles(
                      circles.map((c) => ({
                        ...c,
                        color: getRandomColor(),
                      }))
                    );
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition"
                >
                  随机更换颜色
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GooeyBackground;
