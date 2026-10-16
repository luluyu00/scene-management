import type { ReactNode } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, Layers } from 'lucide-react'

const nav = [{ key: 'scenarios', label: '场景管理', href: '/', icon: Layers }] as const

const labelMap: Record<string, string> = {
  scenarios: '场景管理',
  test: '测试台',
  new: '新建场景',
  edit: '编辑场景',
}

export function AppShell({
  children,
  active,
  crumb,
  action,
}: {
  children: ReactNode
  active: 'scenarios' | 'test' | 'new'
  crumb?: string
  showTabs?: boolean
  action?: ReactNode
}) {
  const crumbLabel = crumb ?? labelMap[active]
  const navActive = active === 'new' ? 'scenarios' : active

  return (
    <div className="flex min-h-screen bg-background">
      {/* 侧边栏 */}
      <aside className="flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center gap-2.5 px-4">
          <span
            className="flex size-[22px] items-center justify-center rounded-md text-white"
            style={{ background: 'linear-gradient(135deg, #1677ff, #7c5cff)' }}
          >
            <Layers className="size-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            一句话画像运营台
          </span>
        </div>

        <div className="px-3 pt-3">
          <p className="px-2 pb-2 text-xs font-medium text-sidebar-foreground/50">运营配置</p>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => {
              const isActive = item.key === navActive
              const Icon = item.icon
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-md border-l-[3px] px-2.5 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'border-primary bg-sidebar-accent text-white'
                      : 'border-transparent text-sidebar-foreground/80 hover:bg-sidebar-accent/40 hover:text-white'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-6">
          <nav className="flex items-center gap-2 text-[13px]">
            <span className="text-muted-foreground">首页</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground">{crumbLabel}</span>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {action}
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="客户、活动、商机、业务、产品"
                className="h-8 w-60 rounded-md border border-input bg-card pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
            </div>
            <button className="flex items-center gap-1.5 text-[13px] text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                张
              </span>
              张三三
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* 主区 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
