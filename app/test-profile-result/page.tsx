import { Info, Search, Sparkles, RotateCcw } from "lucide-react"

const groups = [
  {
    path: ["账户属性", "开户信息"],
    tags: [
      { value: "张", offline: false },
      { value: "男", offline: false },
      { value: "五星", offline: false },
    ],
  },
  {
    path: ["账户属性", "客户风险三要素"],
    tags: [
      { value: "进取型", offline: false },
      { value: "股票", offline: false },
    ],
  },
  {
    path: ["资产与交易", "持仓与交易"],
    tags: [
      { value: "约625万", offline: false },
      { value: "高换手", offline: false },
      { value: "宁德时代", offline: false },
      { value: "贵州茅台", offline: false },
      { value: "近15日交易6笔", offline: false },
      { value: "融资余额（已下线）", offline: true },
    ],
  },
]

const profileTags = "核心交易客｜高资产｜高活跃｜进取型"

const profileBody =
  "张先生为本公司五星级客户，风险偏好为进取型，主要交易品种为股票。截至最新交易日，账户总资产约 625 万元，持仓相对集中，主要配置宁德时代、贵州茅台等标的。近 15 日交易 6 笔、换手率较高，账户活跃度处于同类客户前列。整体呈现高资产、高活跃的交易型客户特征，风险承受能力较强。"

export default function TestProfileResultPage() {
  return (
    <main className="min-h-screen w-full bg-[#f5f7fa] px-6 py-10">
      <div className="mx-auto w-full max-w-[1080px]">
        <section className="rounded-lg border border-[#e8ebf0] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          {/* 模块头 */}
          <div className="mb-1 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#1677ff]" />
            <h2 className="text-[15px] font-semibold text-[#1f2733]">{'测试“一句话画像”'}</h2>
          </div>
          <p className="mb-5 flex items-start gap-1.5 pl-3 text-[13px] text-[#8a94a6]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b4bcc8]" />
            基于本页当前填写内容测试。
          </p>

          <div className="grid grid-cols-12 gap-5">
            {/* 左栏 · 已查询成功 */}
            <div className="col-span-12 lg:col-span-5">
              <div className="rounded-md border border-[#e8ebf0] bg-white p-4">
                <p className="mb-1.5 text-[13px] font-medium text-[#1f2733]">客户ID</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value="C001"
                    className="h-9 min-w-0 flex-1 rounded-md border border-[#d5dae2] bg-white px-3 text-[13px] text-[#1f2733] focus:border-[#1677ff] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[#d5dae2] bg-white px-3 text-[13px] font-medium text-[#4a5568] transition-colors hover:border-[#1677ff] hover:text-[#1677ff]"
                  >
                    <Search className="h-4 w-4" />
                    查询画像标签
                  </button>
                </div>

                {/* 标签展示区 · 树路径分组 + 值胶囊 */}
                <div className="mt-4 flex flex-col gap-3">
                  {groups.map((g) => (
                    <div key={g.path.join("/")}>
                      <p className="mb-2 text-xs font-medium text-[#8a94a6]">{g.path.join(" / ")}</p>
                      <div className="flex flex-wrap gap-2">
                        {g.tags.map((t, i) => (
                          <span
                            key={i}
                            className={
                              t.offline
                                ? "inline-flex items-center rounded-md border border-[#f5222d] bg-white px-2.5 py-1 text-[13px] text-[#cf1322]"
                                : "inline-flex items-center rounded-md border border-transparent bg-[#f2f4f7] px-2.5 py-1 text-[13px] text-[#4a5568]"
                            }
                          >
                            {t.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部按钮 */}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#1677ff] px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#0f66e0]"
                  >
                    <Sparkles className="h-4 w-4" />
                    生成一句话画像
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#d5dae2] bg-white px-3 py-2 text-[13px] font-medium text-[#4a5568] transition-colors hover:border-[#1677ff] hover:text-[#1677ff]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    清空重测
                  </button>
                </div>
              </div>
            </div>

            {/* 右栏 · 已生成 */}
            <div className="col-span-12 lg:col-span-7">
              <div className="h-full rounded-md border border-[#e8ebf0] bg-white">
                <div className="border-b border-[#e8ebf0] px-4 py-3">
                  <span className="text-sm font-medium text-[#1f2733]">生成结果</span>
                </div>
                <div className="p-4">
                  {/* 一句话画像 · 主内容 */}
                  <div className="rounded-md border border-[#e8ebf0] bg-[#fafbfc] p-5">
                    <p className="mb-3 text-[15px] font-semibold text-[#1677ff]">{profileTags}</p>
                    <p className="text-[15px] leading-loose text-[#1f2733]">{profileBody}</p>
                  </div>
                  {/* 辅助信息 · 弱化 */}
                  <p className="mt-3 text-xs text-[#a0a8b4]">
                    字数 186｜生成时间 2026-09-22 13:40｜所用标签 12（已排除下线）
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
