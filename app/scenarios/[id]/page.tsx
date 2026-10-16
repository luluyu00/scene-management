import { AppShell } from '@/components/app-shell'
import { ScenarioEditor } from '@/components/scenario-editor'
import { scenarios } from '@/lib/mock-data'

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }))
}

export default async function ScenarioConfigPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await params
  return (
    <AppShell active="scenarios">
      <ScenarioEditor mode="edit" />
    </AppShell>
  )
}
