/**
 * ProductSpecs — Technical specifications table component.
 *
 * @param {Object} props
 * @param {Array<{ group: string, items: Array<{ label: string, value: string }> }>} props.specifications
 */
export default function ProductSpecs({ specifications = [] }) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D2D2D7]/60 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F]">
          Spesifikasi Teknis
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
          Rincian hardware, fitur unggulan, dan kompatibilitas perangkat resmi.
        </p>
      </div>

      <div className="space-y-8">
        {specifications.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#86868B]">
              {group.group}
            </h3>

            <div className="bg-white rounded-2xl border border-[#D2D2D7]/60 overflow-hidden divide-y divide-[#D2D2D7]/40 shadow-2xs">
              {group.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm gap-1 sm:gap-4 hover:bg-[#F5F5F7]/50 transition-colors"
                >
                  <span className="font-semibold text-[#1D1D1F] sm:col-span-1">
                    {item.label}
                  </span>
                  <span className="text-[#424245] sm:col-span-2 leading-relaxed">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
