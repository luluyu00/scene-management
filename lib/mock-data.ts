export type ScenarioStatus = 'draft' | 'published' | 'disabled'
export type PromptStatus = 'unset' | 'configured'

export interface Scenario {
  id: string
  name: string
  description: string
  tagCount: number
  promptStatus: PromptStatus
  status: ScenarioStatus
  operator: string
  operatedAt: string
}

export const scenarios: Scenario[] = [
  {
    id: 'retail-qa',
    name: '零售客户问答',
    description: '面向零售条线客户经理，围绕账户资产、持仓与近期交易生成客观画像，辅助资讯问答应答。',
    tagCount: 18,
    promptStatus: 'configured',
    status: 'published',
    operator: '张三三',
    operatedAt: '2026-09-12 15:42:07',
  },
  {
    id: 'institution-qa',
    name: '机构客户问答',
    description: '面向机构服务团队，突出产品持仓结构、风险偏好与交易规模，用于机构资讯问答场景。',
    tagCount: 24,
    promptStatus: 'configured',
    status: 'draft',
    operator: '李思远',
    operatedAt: '2026-09-13 09:18:33',
  },
  {
    id: 'wealth-qa',
    name: '财富管理问答',
    description: '聚焦高净值客户的资产配置与理财偏好，生成合规的客观描述，暂未配置生成提示词。',
    tagCount: 9,
    promptStatus: 'unset',
    status: 'disabled',
    operator: '王敏',
    operatedAt: '2026-08-30 20:05:12',
  },
]

// 画像标签树
export interface TagCategory {
  id: string
  name: string
  count: number
  groups: {
    name: string
    tags: string[]
  }[]
}

export const tagTree: TagCategory[] = [
  {
    id: 'account',
    name: '账户属性',
    count: 12,
    groups: [
      { name: '开户信息', tags: ['客户号', '姓氏', '性别', '开户年限', '客户星级', '所属营业部'] },
      { name: '账户状态', tags: ['账户状态', '是否休眠', '是否两融', '是否港股通', '是否创业板', '是否科创板'] },
    ],
  },
  {
    id: 'asset',
    name: '资产与交易',
    count: 14,
    groups: [
      { name: '资产规模', tags: ['总资产', '证券市值', '可用资金', '近一月日均资产', '资产等级'] },
      { name: '交易特征', tags: ['近一月交易频次', '近一月成交额', '换手率', '偏好交易时段', '常用交易品种'] },
      { name: '盈亏情况', tags: ['账户浮动盈亏', '近一年收益率', '最大回撤', '持仓集中度'] },
    ],
  },
  {
    id: 'risk',
    name: '风险测评',
    count: 8,
    groups: [
      { name: '客户风险三要素', tags: ['风险承受能力', '风险测评等级', '测评到期日'] },
      { name: '投资经验', tags: ['投资年限', '衍生品经验', '两融经验', '知识测评结果', '专业投资者认定'] },
    ],
  },
  {
    id: 'preference',
    name: '投资偏好与持仓',
    count: 11,
    groups: [
      { name: '持仓结构', tags: ['前三大重仓行业', '股票仓位占比', '基金持仓占比', '持有产品数'] },
      { name: '投资偏好', tags: ['偏好板块', '偏好风格', '是否定投', '持有理财产品', '偏好投资期限', '关注指数', '偏好资讯类型'] },
    ],
  },
  {
    id: 'behavior',
    name: '平台行为',
    count: 10,
    groups: [
      { name: '活跃度', tags: ['近一月登录天数', '日均使用时长', '主要使用端', '最近登录时间'] },
      { name: '内容偏好', tags: ['资讯浏览偏好', '自选股数量', '关注公告类型', '订阅投顾组合', '参与直播次数', '智能问答使用频次'] },
    ],
  },
]

// 已选标签（场景配置页 · 本地分组）
export interface LocalGroup {
  id: string
  name: string
  tags: string[]
}

export const scenarioGroups: LocalGroup[] = [
  { id: 'g1', name: '客户概览', tags: ['姓氏', '性别', '客户星级', '开户年限', '所属营业部'] },
  { id: 'g2', name: '资产特征', tags: ['总资产', '证券市值', '可用资金', '资产等级'] },
  { id: 'g3', name: '交易特征', tags: ['近一月交易频次', '换手率', '偏好交易时段'] },
  { id: 'g4', name: '投资偏好与持仓', tags: ['前三大重仓行业', '股票仓位占比', '偏好板块', '风险测评等级'] },
  { id: 'g5', name: '近期行为', tags: ['近一月登录天数', '资讯浏览偏好', '自选股数量'] },
]

export const samplePrompt = `你是证券资讯问答助手的「一句话画像」生成模块。请根据给定的【场景】与【画像标签事实】，为客户生成一段客观的用户画像摘要，供资讯问答 Agent 参考。

要求：
1. 称呼使用「姓氏 + 先生/女士」，严禁使用客户真实全名或身份证等敏感信息。
2. 仅可基于给定标签事实进行描述，不得猜测、推断或补全缺失信息；标签无值时直接省略，不做说明。
3. 严禁给出任何股票、基金等投资建议或买卖倾向，仅做客观陈述。
4. 语气正式、专业、简洁，总长度不超过 500 字，输出为一段连续文本。
5. 结构参考：客户概览一句 → 资产与交易特征 → 持仓要点 → 近期行为。`

export const sampleProfile = `王先生为本司五星级客户，开户已 8 年，归属深圳前海营业部。当前总资产约 286.5 万元，其中证券市值 231.2 万元、可用资金 55.3 万元，属高净值资产等级，风险测评为积极型。近一月交易频次中等（22 笔），换手率偏低，偏好在开盘及尾盘时段操作。持仓集中于新能源、半导体与消费电子三大行业，股票仓位占比约 78%，另持有 2 只偏股型基金。近一月登录 24 天，资讯浏览偏好以行业研究与公司公告为主，自选股 36 只，近期对新能源板块关注度较高。`
