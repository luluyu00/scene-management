import Link from 'next/link'
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { buttonVariants } from '@/components/ui/button'
import { scenarios, type ScenarioStatus } from '@/lib/mock-data'

const statusText: Record<ScenarioStatus, string> = {
  published: '已发布',
  draft: '待发布',
  disabled: '已停用',
}

export default function ScenarioListPage() {
  return (
    <AppShell active="scenarios">
      <div className="flex h-full min-h-0 flex-col">
        {/* 顶部标题栏 */}
        <div className="flex items-start justify-between border-b border-border bg-muted/60 px-5 py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-foreground">场景管理</h1>
            <p className="max-w-4xl text-[13px] leading-relaxed text-muted-foreground">
              配置资讯问答所用的一句话画像场景：维护场景与标签、配置提示词，发布后供 Agent 使用；可从列表进入测试，按当前配置验证生成效果。
            </p>
          </div>
          <Link href="/scenarios/new" target="_blank" className={buttonVariants({ size: 'sm', className: 'shrink-0' })}>
            <Plus className="size-4" />
            新建
          </Link>
        </div>

        {/* 内容区 */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 py-4">
          {/* 搜索与筛选 */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] text-foreground">关键词</span>
                <div className="relative w-40">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="请输入搜索关键词"
                    className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
                  />
                </div>
              </label>
              <Filter label="状态" placeholder="全部" />
              <div className="flex items-center gap-2">
                <button className={buttonVariants({ size: 'sm', className: 'h-9 px-5' })}>查询</button>
                <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-5 text-[13px] font-medium text-foreground hover:bg-muted">
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* 表格 */}
          <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <h2 className="text-[15px] font-semibold text-foreground">场景管理列表</h2>
              <span className="text-[13px] text-muted-foreground">共 {scenarios.length} 条</span>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">场景名称</th>
                    <th className="px-4 py-2.5 font-medium">场景描述</th>
                    <th className="px-4 py-2.5 font-medium">已选标签</th>
                    <th className="px-4 py-2.5 font-medium">状态</th>
                    <th className="px-4 py-2.5 font-medium">操作人</th>
                    <th className="px-4 py-2.5 font-medium">操作时间</th>
                    <th className="px-4 py-2.5 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s) => (
                    <tr key={s.id} className="border-b border-border text-foreground last:border-0 hover:bg-muted/40">
                      <td className="whitespace-nowrap px-4 py-3">{s.name}</td>
                      <td className="max-w-xs px-4 py-3">
                        <span className="block truncate">{s.description}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{s.tagCount}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {statusText[s.status]}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-primary">{s.operator}</td>
                      <td className="whitespace-nowrap px-4 py-3">{s.operatedAt}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/scenarios/${s.id}`} className="text-primary underline">
                            编辑
                          </Link>
                          <Link href={`/scenarios/${s.id}#test`} className="text-primary underline">
                            测试
                          </Link>
                          {s.status === 'draft' ? (
                            <>
                              <button className="text-primary underline">发布</button>
                              <button className="text-primary underline">停用</button>
                            </>
                          ) : (
                            <button className="text-primary underline">
                              {s.status === 'published' ? '停用' : '发布'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <Pagination />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function Filter({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] text-foreground">{label}</span>
      <button className="flex h-9 w-40 items-center justify-between rounded-md border border-input bg-card px-3 text-[13px] text-muted-foreground hover:bg-muted">
        {placeholder}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
    </label>
  )
}

function Pagination() {
  const pages = [1, 2, 3]
  return (
    <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3 text-[13px] text-muted-foreground">
      <span className="mr-1 text-muted-foreground">共 128 条</span>
      <button className="flex size-8 items-center justify-center rounded border border-input text-muted-foreground hover:bg-muted">
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`flex size-8 items-center justify-center rounded border text-[13px] ${
            p === 1
              ? 'border-primary bg-card font-medium text-primary'
              : 'border-input text-foreground hover:bg-muted'
          }`}
        >
          {p}
        </button>
      ))}
      <button className="flex size-8 items-center justify-center rounded border border-input text-muted-foreground hover:bg-muted">
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
