import type { Metadata } from "next"
import { getAssets, aggregateAssetsByType } from "@/lib/notion"
import { formatKRW, formatPercent } from "@/lib/utils"
import type { AssetType } from "@/types/notion"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "자산 목록",
}

const TYPE_COLORS: Record<AssetType, string> = {
  현금: "bg-blue-100 text-blue-800",
  주식: "bg-green-100 text-green-800",
  ETF: "bg-purple-100 text-purple-800",
  부동산: "bg-orange-100 text-orange-800",
  기타: "bg-gray-100 text-gray-800",
}

export default async function AssetsPage() {
  const assets = await getAssets()
  const byType = aggregateAssetsByType(assets)
  const totalAmount = assets.reduce((sum, a) => sum + a.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold">자산 목록</h1>
          <p className="text-muted-foreground text-sm mt-1">
            총 {assets.length}개 자산 &mdash; 합계:{" "}
            <span className="font-medium text-foreground">
              {formatKRW(totalAmount)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(Object.entries(byType) as [AssetType, number][]).map(
            ([type, amount]) => (
              <div key={type} className="flex flex-col gap-1 p-4 rounded-xl border bg-card">
                <span className="text-xs text-muted-foreground">{type}</span>
                <span className="text-sm font-semibold">{formatKRW(amount)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatPercent((amount / totalAmount) * 100)}
                </span>
              </div>
            )
          )}
        </div>

        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">자산명</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">금액</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">유형</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">수익률</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">비중</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    자산 데이터가 없습니다. Notion DB에 데이터를 추가해주세요.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{asset.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatKRW(asset.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[asset.type] ?? TYPE_COLORS["기타"]}`}>
                        {asset.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-medium ${asset.returnRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {asset.returnRate >= 0 ? "+" : ""}
                      {formatPercent(asset.returnRate)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {totalAmount > 0 ? formatPercent((asset.amount / totalAmount) * 100) : "0%"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {assets.length > 0 && (
              <tfoot className="bg-muted/50 border-t">
                <tr>
                  <td className="px-4 py-3 font-semibold">합계</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatKRW(totalAmount)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
