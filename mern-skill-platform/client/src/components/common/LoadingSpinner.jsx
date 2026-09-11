export default function LoadingSpinner({ fullScreen = true, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-10 h-10 border-3', lg: 'w-14 h-14 border-4' }
  const spinner = (
    <div className="relative flex items-center justify-center">
      <div className={`${sizes[size] || sizes.md} border-indigo-200 rounded-full`} />
      <div className={`absolute ${sizes[size] || sizes.md} border-indigo-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  )

  if (!fullScreen) {
    return <div className="flex justify-center items-center py-8 page-enter">{spinner}</div>
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent page-enter">
      {spinner}
      <p className="text-gray-400 mt-3 text-xs font-medium tracking-wide animate-pulse">Loading...</p>
    </div>
  )
}
