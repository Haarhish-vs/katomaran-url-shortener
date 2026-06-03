export default function LoadingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin"
          style={{ borderTopColor: '#22d3ee', borderRightColor: '#22d3ee' }}
        />
      </div>
      <p className="mt-6 text-base font-semibold text-white">Creating Smart Link…</p>
      <p className="mt-2 text-sm text-slate-400">This will only take a moment.</p>
    </div>
  )
}
