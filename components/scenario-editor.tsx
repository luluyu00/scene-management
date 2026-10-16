'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  X,
  Search,
  RotateCcw,
  Copy,
  RefreshCw,
  Pencil,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  AlertTriangle,
  Check,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TagDrawer } from '@/components/tag-drawer'
import { PublishModal } from '@/components/publish-modal'
import { MergeTagsModal } from '@/components/merge-tags-modal'
import { AddGroupModal } from '@/components/add-group-modal'
import { scenarioGroups, samplePrompt, sampleProfile, type LocalGroup } from '@/lib/mock-data'

const PROMPT_MAX = 1000
const DESC_MAX = 200

const newGroups: LocalGroup[] = [
  { id: 'g1', name: '客户概览', tags: ['姓氏', '性别', '客户星级'] },
  { id: 'g2', name: '持仓情况', tags: ['前三大重仓行业', '股票仓位占比'] },
  { id: 'g3', name: '投资偏好', tags: ['偏好板块', '风险测评等级'] },
]

const AI_STEPS = [
  '解析场景名称与场景描述，识别问答对象与关注维度',
  '在画像标签树中检索匹配的候选标签',
  '按客户概览 / 持仓与交易 / 投资偏好 / 近期行为等维度组织分组',
  '去重并校验不超过标签数量上限后输出配置',
]

const tagValues: Record<string, string> = {
  姓氏: '王',
  性别: '男',
  客户星级: '五星',
  开户年限: '8 年',
  所属营业部: '深圳前海营业部',
  总资产: '286.5 万元',
  证券市值: '231.2 万元',
  可用资金: '55.3 万元',
  资产等级: '高净值',
  近一月交易频次: '22 笔',
  换手率: '偏低',
  偏好交易时段: '开盘 / 尾盘',
  前三大重仓行业: '新能源 / 半导体 / 消费电子',
  股票仓位占比: '78%',
  偏好板块: '新能源',
  风险测评等级: '积极型',
  近一月登录天数: '24 天',
  资讯浏览偏好: '行业研究 / 公司公告',
  自选股数量: '36 只',
}

type TestState = 'empty' | 'loaded' | 'result' | 'notfound'

export function ScenarioEditor({ mode }: { mode: 'new' | 'edit' }) {
  const [name, setName] = useState(mode === 'edit' ? '零售客户问答' : '')
  const [limit, setLimit] = useState(30)
  const [desc, setDesc] = useState(
    mode === 'edit' ? '面向零售客户的资讯问答场景，用于生成客观、合规的一句话客户画像。' : '',
  )
  const [groups, setGroups] = useState<LocalGroup[]>(mode === 'edit' ? scenarioGroups : newGroups)
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id ?? '')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [prompt, setPrompt] = useState(mode === 'edit' ? samplePrompt : '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [mergeOpen, setMergeOpen] = useState(false)
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [newGroupNames, setNewGroupNames] = useState<string[]>([''])
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'done'>('idle')
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [panelCollapsed, setPanelCollapsed] = useState(false)

  const totalTags = groups.reduce((n, g) => n + g.tags.length, 0)
  const current = groups.find((g) => g.id === activeGroup) ?? groups[0]
  const canGenerate = name.trim().length > 0 && desc.trim().length > 0

  const removeTag = (groupId: string, tag: string) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, tags: g.tags.filter((t) => t !== tag) } : g)))
  }

  const addTagsToCurrent = (tags: string[]) => {
    if (!current) return
    setGroups((prev) => prev.map((g) => (g.id === current.id ? { ...g, tags } : g)))
    setDrawerOpen(false)
  }

  const runGenerate = () => {
    setAiState('thinking')
    setVisibleSteps(0)
    setPanelCollapsed(false)
  }

  useEffect(() => {
    if (aiState !== 'thinking') return
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= AI_STEPS.length; i++) {
      timers.push(setTimeout(() => setVisibleSteps(i), i * 750))
    }
    timers.push(
      setTimeout(
        () => {
          setGroups(newGroups)
          setActiveGroup(newGroups[0].id)
          setAiState('done')
        },
        AI_STEPS.length * 750 + 600,
      ),
    )
    return () => timers.forEach(clearTimeout)
  }, [aiState])

  const handleAiTags = () => {
    if (!canGenerate) return
    if (totalTags > 0) {
      setMergeOpen(true)
    } else {
      runGenerate()
    }
  }

  const confirmMerge = () => {
    setMergeOpen(false)
    runGenerate()
  }

  return (
    <div className="pb-24">
      {/* 灰底页头 */}
      <div className="border-b border-border bg-muted/60 px-5 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-0.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          返回场景管理
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
          {mode === 'new' ? '新建场景' : '编辑场景'}
        </h1>
        <p className="mt-1 max-w-4xl text-[13px] leading-relaxed text-muted-foreground">
          填写场景名称与描述，AI 生成并调整画像标签与一句话画像提示词；可在本页用客户 ID
          查询标签并试生成，确认无误后再保存或发布。
        </p>
      </div>

      <div className="px-5 py-4">
      {/* 1) 基本信息 */}
      <Section title="基本信息">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Field label="场景名称" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入场景名称"
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
          </Field>
          <Field label="标签数量上限" required>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-[13px] text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
          </Field>
        </div>
        <Field label="场景描述" required className="mt-5 block">
          <div className="relative">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, DESC_MAX))}
              maxLength={DESC_MAX}
              rows={3}
              placeholder="请输入场景描述"
              className="w-full resize-none rounded-md border border-input bg-card px-3.5 py-2.5 pb-7 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
            />
            <span className="pointer-events-none absolute bottom-2.5 right-3 text-xs text-muted-foreground">
              {desc.length}/{DESC_MAX}
            </span>
          </div>
        </Field>
      </Section>

      {/* 2) 画像标签配置 */}
      <Section
        title="画像标签配置"
        required
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAiTags}
              disabled={aiState === 'thinking'}
            >
              {aiState === 'thinking' ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  生成中…
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  AI 生成标签配置
                </>
              )}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
              <Plus className="size-3.5" />
              从画像标签树添加
            </Button>
          </div>
        }
      >
        <p className="-mt-1 mb-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
          根据场景名称 + 场景描述，从画像标签树自动生成分组及标签；管理员可手工调整；已有配置再次自动生成时内容将合并。
        </p>

        {/* AI 思考过程面板 */}
        {aiState !== 'idle' && (
          <div className="mb-3 overflow-hidden rounded-lg border border-border bg-[#f7f9fc]">
            <button
              type="button"
              onClick={() => setPanelCollapsed((v) => !v)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-3 text-primary" />
              </span>
              <span className="text-[13px] font-medium text-foreground">
                {aiState === 'thinking' ? '正在生成标签配置' : '标签配置生成完成'}
              </span>
              <ChevronUp
                className={`ml-auto size-4 text-muted-foreground transition-transform ${panelCollapsed ? 'rotate-180' : ''}`}
              />
            </button>

            {!panelCollapsed && (
              <div className="px-4 pb-4">
                <div className="mb-2 flex items-center gap-1.5">
                  {aiState === 'thinking' ? (
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                  ) : (
                    <span className="flex size-3.5 items-center justify-center rounded-full bg-primary">
                      <Check className="size-2.5 text-primary-foreground" />
                    </span>
                  )}
                  <span className="text-[13px] text-muted-foreground">
                    {aiState === 'thinking' ? '正在思考中' : '思考完成'}
                  </span>
                </div>
                <p className="mb-2 text-xs text-muted-foreground/90">将按以下步骤完成本场景的标签配置：</p>
                <ol className="space-y-1.5">
                  {AI_STEPS.map((step, i) => {
                    const shown = aiState === 'done' || i < visibleSteps
                    const active = aiState === 'thinking' && i === visibleSteps - 1
                    return (
                      <li
                        key={step}
                        className={`flex items-start gap-2 text-xs leading-relaxed transition-opacity ${
                          shown ? 'opacity-100' : 'opacity-0'
                        } ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                        <span>{step}</span>
                      </li>
                    )
                  })}
                </ol>
                {aiState === 'thinking' && (
                  <p className="mt-3 text-[11px] text-muted-foreground/70">预计需要数秒，请稍候…</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 生成中仅显示思考面板；idle 或 done 时展示分组标签 */}
        {aiState !== 'thinking' && (
        <div className="rounded-md border border-border bg-card">
          {/* 内容区顶部工具行 */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">分组</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                已选 <span className="font-medium text-foreground">{totalTags}</span> / 上限 {limit}
              </span>
              <button
                onClick={() => {
                  setNewGroupNames([''])
                  setAddGroupOpen(true)
                }}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="size-3" />
                新增分组
              </button>
            </div>
          </div>

          {/* 按组纵向堆叠 */}
          <div className="flex flex-col gap-3 p-3">
            {groups.map((g) => (
              <div
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`cursor-pointer rounded-md border bg-card px-4 py-3.5 transition-colors ${
                  selectedGroup === g.id ? 'border-primary' : 'border-border'
                }`}
              >
                {/* 组头行 */}
                <div className="mb-2.5 flex items-center gap-1.5">
                  <GripVertical className="size-3.5 shrink-0 cursor-grab text-muted-foreground/50" />
                  <span className="text-[13px] font-medium text-foreground">{g.name}</span>
                  <span className="rounded bg-muted px-1.5 text-xs text-muted-foreground">{g.tags.length}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    <Pencil className="size-3.5 cursor-pointer text-muted-foreground hover:text-foreground" />
                    <Trash2 className="size-3.5 cursor-pointer text-muted-foreground hover:text-destructive" />
                  </span>
                </div>
                {/* 组标签胶囊 */}
                <div className="flex flex-wrap gap-2">
                  {g.tags.length === 0 ? (
                    <p className="py-1.5 text-[13px] text-muted-foreground">
                      该分组暂无标签，点击右上角从画像标签树添加。
                    </p>
                  ) : (
                    g.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-muted pl-2.5 pr-1.5 text-[13px] text-foreground"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(g.id, tag)}
                          className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-border hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </Section>

      {/* 3) 一句话画像提示词 */}
      <Section
        title={'“一句话画像”提示词'}
        required
        action={
          <Button type="button" variant="outline" size="sm">
            <Sparkles className="size-3.5" />
            自动生成提示词初稿
          </Button>
        }
      >
        <p className="-mt-1 mb-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
          请先完成标签配置，再生成提示词初稿；生成后可手工修改。
        </p>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, PROMPT_MAX))}
            maxLength={PROMPT_MAX}
            rows={12}
            placeholder={'请输入生成“一句话画像”的提示词'}
            className="w-full resize-none rounded-md border border-input bg-card px-3.5 py-3 pb-7 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/25"
          />
          <span className="pointer-events-none absolute bottom-2.5 right-3 text-xs text-muted-foreground">
            {prompt.length}/{PROMPT_MAX}
          </span>
        </div>
      </Section>

      {/* 4) 页内测试模块 */}
      <InlineTest groups={groups} totalTags={totalTags} />
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-border bg-card px-6 py-3">
        <Button type="button" variant="outline" className="border-border bg-card text-foreground hover:bg-muted">
          取消
        </Button>
        <Button type="button" variant="outline" className="border-border bg-card text-foreground hover:bg-muted">
          保存
        </Button>
        <Button type="button" onClick={() => setPublishOpen(true)}>
          发布
        </Button>
      </div>

      <TagDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selected={current?.tags ?? []}
        onConfirm={addTagsToCurrent}
      />
      <MergeTagsModal
        open={mergeOpen}
        onClose={() => setMergeOpen(false)}
        onConfirm={confirmMerge}
        current={totalTags}
        added={9}
        limit={limit}
      />
      <AddGroupModal
        open={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        names={newGroupNames}
        setNames={setNewGroupNames}
        onConfirm={() => {
          const toAdd = newGroupNames.map((n) => n.trim()).filter(Boolean)
          if (toAdd.length > 0) {
            setGroups((prev) => [
              ...prev,
              ...toAdd.map((n, i) => ({ id: `g-${Date.now()}-${i}`, name: n, tags: [] })),
            ])
          }
          setAddGroupOpen(false)
        }}
      />
      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        scenarioName={name || '未命名场景'}
        tagCount={totalTags}
        promptPreview={prompt}
        checks={[
          { label: '已填写场景名称', passed: name.trim().length > 0 },
          { label: `已选不少于 5 个标签（当前 ${totalTags} 个）`, passed: totalTags >= 5 },
          { label: '已配置生成提示词', passed: prompt.trim().length > 0 },
        ]}
      />
    </div>
  )
}

function InlineTest({ groups, totalTags }: { groups: LocalGroup[]; totalTags: number }) {
  const [state, setState] = useState<TestState>('empty')
  const [cust, setCust] = useState('')
  const [open, setOpen] = useState<string[]>(groups.map((g) => g.id))

  const toggleGroup = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const pull = () => setState(cust.trim() === '000' ? 'notfound' : 'loaded')
  const generate = () => setState('result')

  return (
    <section id="test" className="mt-6 scroll-mt-4 rounded-lg border-2 border-primary/30 bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-semibold text-foreground">{'测试“一句话画像”'}</h2>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
          由列表「测试」进入时高亮
        </span>
      </div>
      <p className="mb-4 flex items-start gap-1.5 pl-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
        基于本页当前填写内容测试。
      </p>

      <div className="grid grid-cols-12 gap-5">
        {/* 左 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="mb-1.5 text-[13px] font-medium text-foreground">客户ID</p>
            <div className="flex gap-2">
              <input
                value={cust}
                onChange={(e) => setCust(e.target.value)}
                placeholder="请输入客户ID"
                className="h-9 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <Button variant="outline" onClick={pull}>
                <Search className="size-4" />
                查询画像标签
              </Button>
            </div>

            {state === 'notfound' ? (
              <div className="mt-4 flex flex-col items-center rounded-md border border-dashed border-warning/40 bg-warning/5 px-4 py-8 text-center">
                <AlertTriangle className="size-6 text-warning" />
                <p className="mt-2 text-[13px] font-medium text-foreground">未查询到该客户���据</p>
                <p className="mt-1 text-xs text-muted-foreground">请确认客户ID是否属于测试环境，或稍后重试同步。</p>
              </div>
            ) : state === 'empty' ? (
              <div className="mt-4 flex flex-col items-center rounded-md border border-dashed border-border px-4 py-8 text-center">
                <Search className="size-6 text-muted-foreground/60" />
                <p className="mt-2 text-[13px] text-muted-foreground">输入客户ID并查询，按本场景分组展示画像标签</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {groups.map((g) => {
                  const isOpen = open.includes(g.id)
                  return (
                    <div key={g.id} className="rounded-md border border-border">
                      <button
                        onClick={() => toggleGroup(g.id)}
                        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[13px] font-medium text-foreground"
                      >
                        <ChevronRight
                          className={`size-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`}
                        />
                        {g.name}
                        <span className="ml-auto text-xs text-muted-foreground">{g.tags.length}</span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-border">
                          {g.tags.map((tag) => {
                            const val = tagValues[tag]
                            return (
                              <div
                                key={tag}
                                className="flex items-center justify-between px-3 py-1.5 text-[13px] odd:bg-muted/30"
                              >
                                <span className="text-muted-foreground">{tag}</span>
                                {val ? (
                                  <span className="font-medium text-foreground">{val}</span>
                                ) : (
                                  <span className="text-muted-foreground/50">无数据</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button className="flex-1" disabled={state !== 'loaded' && state !== 'result'} onClick={generate}>
                <Sparkles className="size-4" />
                生成一句话画像
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCust('')
                  setState('empty')
                }}
              >
                <RotateCcw className="size-4" />
                清空重测
              </Button>
            </div>
          </div>
        </div>

        {/* 右 */}
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-medium text-foreground">生成结果</span>
              {state === 'result' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="size-3.5" />
                    复制文案
                  </Button>
                  <Button variant="outline" size="sm" onClick={generate}>
                    <RefreshCw className="size-3.5" />
                    再次生成
                  </Button>
                </div>
              )}
            </div>
            {state === 'result' ? (
              <div className="p-4">
                <div className="rounded-md border border-border bg-muted/30 p-4 text-[15px] leading-loose text-foreground">
                  {sampleProfile}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-md bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
                  <Meta label="字数" value={`${sampleProfile.length}`} />
                  <Meta label="所用标签" value={`${totalTags}`} />
                  <Meta label="生成时间" value="2026-09-14 10:26:11" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="size-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-[13px] font-medium text-foreground">尚未生成一句话画像</p>
                <p className="mt-1 text-xs text-muted-foreground">在左侧查询到客户标签后，点击「生成一句话画像」查看结果。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Section({
  title,
  required,
  action,
  children,
}: {
  title: string
  required?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 rounded-md border border-border bg-card p-5">
      <div className="-mx-5 mb-4 flex items-center justify-between border-b border-border px-5 pb-3">
        <h2 className="flex items-center gap-1 text-sm font-semibold text-foreground">
          {required && <span className="text-destructive">*</span>}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  className = 'block',
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-foreground">
        {required && <span className="text-destructive">*</span>}
        {label}
      </span>
      {children}
    </label>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      <span className="font-medium text-foreground">{value}</span>
    </span>
  )
}
