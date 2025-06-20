import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { MetropoleForm } from "@/components/metropole-form"

export default function CreatePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Criar Novo Registro" text="Adicione um novo registro à Shalom Consórcios." />
      <div className="grid gap-4">
        <MetropoleForm />
      </div>
    </DashboardShell>
  )
}
