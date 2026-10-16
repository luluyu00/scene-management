'use client'

import { X, GitMerge } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MergeTagsModal({
  open,
  onClose,
  onConfirm,
  current,
  added,
  limit,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  current: number
  added: number
  limit: number
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
        {/* 标题 */}
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <span className="h-4 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold text-foreground">合并生成标签配置？</h2>
          <button
            onClick={onClose}
            className="ml-auto flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="关闭"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 正文 */}
        <div className="px-5 py-4">
          <p className="text-[13px] leading-relaxed text-foreground">
            系统将根据当前场景名称与场景描述，再次从画像标签树生成分组和标签，并与现有配置合并：
          </p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
              同名分组下的标签去重后追加
            </li>
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
              新分组将新增到列表
            </li>
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
              不会删除你已手动添加的标签（除非超出上限时截断新增部分）
            </li>
            <li className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
              本次生成后总标签数不超过上限 {limit}
            </li>
          </ul>

          {/* 摘要 */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Summary label="当前已选" value={current} />
            <Summary label="预计新增" value={`+${added}`} hint="去重后" accent />
            <Summary label="上限" value={limit} />
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={onConfirm}>
            <GitMerge className="size-4" />
            确认合并生成
          </Button>
        </div>
      </div>
    </div>
  )
}

function Summary({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string | number
  hint?: string
  accent?: boolean
}) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  )
}
