export default function LockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <body className="font-mono antialiased bg-[#d9d9d9] selection:bg-white/10">
        {children}
      </body>
  )
}
