export default function QRCodeSection({ qrCode }) {
  if (!qrCode) return null

  return (
    <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4 w-full">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Scan to redirect</p>
      <div className="bg-white p-3 rounded-xl border border-white/10 w-fit">
        <img src={qrCode} alt="QR Code" className="h-32 w-32 rounded-lg" />
      </div>
    </div>
  )
}
