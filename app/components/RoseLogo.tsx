export default function RoseLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 1024 1024"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M512 0c0 0 256 256 256 512s-256 512-256 512-256-256-256-512S512 0 512 0z" />
      <path d="M512 256c0 0 128 128 128 256s-128 256-128 256-128-128-128-256S512 256 512 256z" />
      <path d="M512 384c0 0 64 64 64 128s-64 128-64 128-64-64-64-128S512 384 512 384z" />
    </svg>
  )
} 