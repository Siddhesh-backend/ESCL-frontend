export default function Table({ columns, data, keyField = 'id', emptyMessage = 'No records found.' }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-navy-100 py-12 text-center text-sm text-navy-700/70">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-100">
      <table className="min-w-full divide-y divide-navy-100 text-sm">
        <thead className="bg-navy-900">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100 bg-white">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-pitch-50">
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-navy-900">
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
