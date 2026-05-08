export default function LiveDot() {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--green)',
        display: 'inline-block',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}
