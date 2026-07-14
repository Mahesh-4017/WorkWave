export default function DataTable<T>() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-3 text-sm font-semibold">Column</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 text-sm">Data Row Placeholder</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
