"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useSidebar()

  const handleLogout = () => {
    // Limpar todos os cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname
    })

    // Limpar localStorage
    localStorage.clear()

    // Limpar sessionStorage
    sessionStorage.clear()

    // Redirecionar para o dashboard externo
    window.location.href = "https://dashboard.levamidia.com.br"
  }

  const navItems = [
    {
      title: "Leads",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      onClick: undefined,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <motion.div
            initial={false}
            animate={{
              opacity: state === "collapsed" ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            {state !== "collapsed" && (
              <>
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">CRM</h2>
                  <p className="text-xs text-gray-600">Shalom Consórcios</p>
                </div>
              </>
            )}
          </motion.div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} onClick={item.onClick}>
                <SidebarMenuButton isActive={pathname === item.href && item.href !== "#"}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}

          {/* Separador */}
          <div className="border-t border-gray-200 my-2 mx-2"></div>

          {/* Botão de Sair */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
