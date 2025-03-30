// app/stocks/page.tsx
import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

type Stock = {
  date: string
  code: string
  name: string
  market: string
  industryCode33: string
  industryName33: string
  industryCode17: string
  industryName17: string
  scaleCode: string
  scaleName: string
}

const validMarkets = [
  'プライム（内国株式）',
  'スタンダード（内国株式）',
  'グロース（内国株式）',
]

export default async function StockPage() {
  const filePath = path.join(process.cwd(), 'public/tse-stocks/202502.csv')
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const parsed: Stock[] = parse(fileContent, {
    columns: (header: string[]) =>
      header.map((col) => {
        switch (col.trim()) {
          case '日付': return 'date'
          case 'コード': return 'code'
          case '銘柄名': return 'name'
          case '市場・商品区分': return 'market'
          case '33業種コード': return 'industryCode33'
          case '33業種区分': return 'industryName33'
          case '17業種コード': return 'industryCode17'
          case '17業種区分': return 'industryName17'
          case '規模コード': return 'scaleCode'
          case '規模区分': return 'scaleName'
          default: return col // fallback
        }
      }),
    skip_empty_lines: true,
  })

  const filtered = parsed.filter(stock =>
    validMarkets.includes(stock.market)
  )

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">東証銘柄一覧（2025年2月）</h1>
      <div className="overflow-auto max-h-[70vh] border rounded">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-2 py-1">コード</th>
              <th className="border px-2 py-1">銘柄名</th>
              <th className="border px-2 py-1">市場</th>
              <th className="border px-2 py-1">業種</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{stock.code}</td>
                <td className="border px-2 py-1">{stock.name}</td>
                <td className="border px-2 py-1">{stock['market']}</td>
                <td className="border px-2 py-1">{stock['industryName33'] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
