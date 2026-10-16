import { AppShell } from '@/components/app-shell'
import { ScenarioEditor } from '@/components/scenario-editor'

export default function NewScenarioPage() {
  return (
    <AppShell active="new" showTabs={false}>
      <ScenarioEditor mode="new" />
    </AppShell>
  )
}
