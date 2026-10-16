import { Sparkles, Plus, Tags } from "lucide-react"

export default function TagConfigEmptyPage() {
  return (
    <main className="min-h-screen w-full bg-[#f5f7fa] px-6 py-10">
      <div className="mx-auto w-full max-w-[1040px]">
        {/* 画像标签配置卡片 */}
        <section className="rounded-lg border border-[#e8ebf0] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          {/* 模块头 */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[15px] font-semibold text-[#1f2733]">
              <span className="mr-1 text-[#f5222d]">*</span>
              画像标签配置
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#1677ff] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#0f66e0]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI 生成标签配置
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-[#d5dae2] bg-white px-3 py-1.5 text-[13px] font-medium text-[#4a5568] transition-colors hover:border-[#1677ff] hover:text-[#1677ff]"
              >
                <Plus className="h-3.5 w-3.5" />
                从画像标签树添加
              </button>
            </div>
          </div>

          {/* 头下说明 */}
          <p className="mt-2 text-[12px] leading-5 text-[#8a94a6]">
            根据场景名称+场景描述，从画像标签树自动生成分组及标签；管理员可手工调整；已有配置再次自动生成时内容将合并。
          </p>

          {/* 内容区顶部工具行 */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#1f2733]">分组</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1677ff] transition-colors hover:text-[#0f66e0]"
            >
              <Plus className="h-3.5 w-3.5" />
              新增分组
            </button>
          </div>

          {/* 内容区 · 空态 */}
          <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#d5dae2] bg-[#fafbfc] px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef1f5]">
              <Tags className="h-7 w-7 text-[#aab2bf]" strokeWidth={1.6} />
            </div>
            <p className="mt-4 text-[14px] font-medium text-[#4a5568]">尚未配置标签</p>
            <p className="mt-1.5 max-w-[440px] text-[12px] leading-5 text-[#8a94a6]">
              请先点击「AI 生成标签配置」，或「+ 新增分组」后从画像标签树添加标签。
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
