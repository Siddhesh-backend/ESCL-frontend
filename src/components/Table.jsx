
export default function Table({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No records found.',
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#243B53] bg-[#0B1B30] py-12 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#243B53] bg-[#0B1B30]">
      <table className="min-w-full divide-y divide-[#243B53] text-sm">
        {/* Table Header */}
        <thead className="bg-[#10243B]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-400"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Rows */}
        <tbody className="divide-y divide-[#243B53] bg-[#0B1B30]">
          {data.map((row, index) => (
            <tr
              key={row[keyField] ?? index}
              className="transition-colors duration-200 hover:bg-[#10243B]"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="whitespace-nowrap px-5 py-4 text-slate-200"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
