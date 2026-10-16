'use client'

import { useState, useMemo } from 'react'
import { Search, X, Check } from 'lucide-react'
import { tagTree } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

const LIMIT = 30

export function TagDrawer({
  open,
  onClose,
  selected,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  selected: string[]
  onConfirm: (tags: string[]) => void
}) {
  const [activeCat, setActiveCat] = useState(tagTree[0].id)
  const [draft, setDraft] = useState<string[]>(selected)
  const [query, setQuery] = useState('')

  const current = tagTree.find((c) => c.id === activeCat)!
  const remaining = LIMIT - draft.length
  const atLimit = draft.length >= LIMIT

  const toggle = (tag: string) => {
    setDraft((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag)
      if (prev.length >= LIMIT) return prev
      return [...prev, tag]
    })
  }

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return current.groups
    return current.groups
      .map((g) => ({ ...g, tags: g.tags.filter((t) => t.includes(query.trim())) }))
      .filter((g) => g.tags.length > 0)
  }, [current, query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative flex h-full w-[720px] flex-col bg-card shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">选择画像标签</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              本次已选 <span className="font-mono font-medium text-primary">{draft.length}</span> 个，场景剩余可选{' '}
              <span className="font-mono font-medium text-foreground">{Math.max(remaining, 0)}</span> 个
            </p>
          </div>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* 搜索 */}
        <div className="border-b border-border px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标签名称"
              className="h-9 w-full rounded-md border border-input bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        {/* 主体：左分类 + 右标签 */}
        <div className="flex min-h-0 flex-1">
          <div className="w-48 shrink-0 overflow-y-auto border-r border-border py-2">
            {tagTree.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] ${
                  cat.id === activeCat
                    ? 'border-r-2 border-primary bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat.name}
                <span className="font-mono text-xs text-muted-foreground">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto px-5 py-4">
            {atLimit && (
              <div className="mb-3 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
                已达标签上限（{LIMIT}），如需继续请先移除部分标签。
              </div>
            )}
            {filteredGroups.map((group) => (
              <div key={group.name} className="mb-5">
                <p className="mb-2 text-xs font-medium text-muted-foreground">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => {
                    const on = draft.includes(tag)
                    const disabled = !on && atLimit
                    return (
                      <button
                        key={tag}
                        onClick={() => toggle(tag)}
                        disabled={disabled}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[13px] transition-colors ${
                          on
                            ? 'border-primary bg-primary/10 font-medium text-primary'
                            : disabled
                              ? 'cursor-not-allowed border-border bg-muted/50 text-muted-foreground/50'
                              : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        {on && <Check className="size-3" />}
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部固定栏 */}
        <div className="border-t border-border px-5 py-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="shrink-0 text-xs text-muted-foreground">已选：</span>
            <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1">
              {draft.length === 0 ? (
                <span className="text-xs text-muted-foreground/70">暂未选择标签</span>
              ) : (
                draft.map((tag) => (
                  <span key={tag} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {tag}
                    <button onClick={() => toggle(tag)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>取消</Button>
            <Button onClick={() => onConfirm(draft)}>确认添加</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
