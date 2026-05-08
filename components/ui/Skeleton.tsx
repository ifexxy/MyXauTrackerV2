export function Skeleton({ width, height, className }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`skeleton ${className ?? ''}`}
      style={{ width: width ?? '100%', height: height ?? 16 }}
    />
  );
}
