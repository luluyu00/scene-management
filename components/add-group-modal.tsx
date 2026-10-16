'use client'

import { X, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AddGroupModal({
  open,
  onClose,
  onConfirm,
  names,
  setNames,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  names: string[]
  setNames: (names: string[]) => void
}) {
  if (!open) return null

  const update = (i: number, value: string) => {
    const next = [...names]
    next[i] = value
    setNames(next)
  }

  const remove = (i: number) => {
    if (names.length <= 1) return
    setNames(names.filter((_, idx) => idx !== i))
  }

  const add = () => setNames([...names, ''])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card shadow-xl">
        {/* 标题 */}
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <span className="h-4 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-semibold text-foreground">新增分组</h2>
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
          <div className="space-y-2.5">
            {names.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-[13px] text-foreground">
                  分组名称<span className="text-destructive"> *</span>
                </label>
                <input
                  value={v}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder="请输入分组名称"
                  className="h-9 flex-1 rounded-md border border-border bg-card px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                />
                <button
                  onClick={() => remove(i)}
                  disabled={names.length <= 1}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="删除该分组输入框"
                >
                  <Minus className="size-3.5" />
                </button>
                {i === 0 ? (
                  <button
                    onClick={add}
                    className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary/10"
                    aria-label="新增分组输入框"
                  >
                    <Plus className="size-3.5" />
                  </button>
                ) : (
                  <span className="size-6 shrink-0" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={onConfirm}>确定</Button>
        </div>
      </div>
    </div>
  )
}
