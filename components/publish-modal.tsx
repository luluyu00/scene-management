'use client'

import { X, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CheckItem {
  label: string
  passed: boolean
}

export function PublishModal({
  open,
  onClose,
  scenarioName,
  tagCount,
  promptPreview,
  checks,
}: {
  open: boolean
  onClose: () => void
  scenarioName: string
  tagCount: number
  promptPreview: string
  checks: CheckItem[]
}) {
  if (!open) return null
  const allPassed = checks.every((c) => c.passed)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">发布场景</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">发布后配置将对 Agent 侧生效</p>
          </div>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          {/* 校验清单 */}
          <p className="mb-2 text-xs font-medium text-muted-foreground">发布前校验</p>
          <ul className="flex flex-col gap-1.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-[13px]">
                {c.passed ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="size-3" />
                  </span>
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <AlertCircle className="size-3" />
                  </span>
                )}
                <span className={c.passed ? 'text-foreground' : 'text-destructive'}>{c.label}</span>
              </li>
            ))}
          </ul>

          {/* 摘要 */}
          <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-[13px]">
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">场景名称</span>
              <span className="font-medium text-foreground">{scenarioName}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted-foreground">标签数量</span>
              <span className="font-mono font-medium text-foreground">{tagCount}</span>
            </div>
            <div className="mt-1.5 border-t border-border pt-1.5">
              <span className="text-muted-foreground">提示词预览</span>
              <p className="mt-1 line-clamp-2 leading-relaxed text-foreground">{promptPreview.slice(0, 80)}…</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button disabled={!allPassed}>确认发布</Button>
        </div>
      </div>
    </div>
  )
}
