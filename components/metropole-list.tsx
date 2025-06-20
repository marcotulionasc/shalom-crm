"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { 
  Phone, 
  Mail, 
  Search, 
  Eye,
  Home,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  RefreshCw
} from "lucide-react"
import type { Metropole } from "@/types/metropole"
import { useProductConfig } from "@/hooks/use-product-config"

// Constante com os status oficiais
const LEAD_STATUS = [
  { value: "NOVO", label: "Novo", color: "bg-blue-500" },
  { value: "CONTATO_FEITO", label: "Contato Feito", color: "bg-yellow-500" },
  { value: "QUALIFICADO", label: "Qualificado", color: "bg-green-500" },
  { value: "NÃO_QUALIFICADO", label: "Não Qualificado", color: "border-red-400 text-red-400" },
  { value: "QUALIFICADO_OP", label: "Qualificado OP", color: "bg-purple-500" },
  { value: "PROPOSTA", label: "Proposta", color: "bg-orange-500" },
  { value: "FECHADO", label: "Fechado", color: "bg-teal-500" },
]

interface MetropoleListProps {
  onProductChange?: (product: string) => void
  onStatusUpdate?: () => void
}

export function MetropoleList({ onProductChange, onStatusUpdate }: MetropoleListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [metropoles, setMetropoles] = useState<Metropole[]>([])
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const tenantId = "7"
  const [product, setProduct] = useState<string>("shalomconsorcios")
  const [searchTerm, setSearchTerm] = useState("")
  const { products } = useProductConfig()

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchMetropoles()
    if (onProductChange) {
      onProductChange(product)
    }
  }, [product])

  const fetchMetropoles = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://backend-ingressar.onrender.com/metropole/v1/data/${tenantId}/${product}`)
      if (!response.ok) {
        throw new Error("Falha ao buscar dados")
      }
      const data = await response.json()
      
      // Ordenar os leads do mais recente para o mais antigo
      const sortedData = data.sort((a: Metropole, b: Metropole) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA // Ordem decrescente (mais recente primeiro)
      })
      
      setMetropoles(sortedData)
      // A paginação será definida no useEffect dos filtros
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = (phone: string, name: string) => {
    const formattedPhone = phone.replace(/\D/g, "")
    const message = encodeURIComponent(
      `Olá ${name}, estamos entrando em contato sobre seu interesse em nossos produtos.`,
    )
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank")
  }

  const handleStatusUpdate = async (leadId: number, newStatus: string) => {
    setUpdatingId(leadId)
    try {
      const response = await fetch(`https://backend-ingressar.onrender.com/metropole/v1/update/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field03: newStatus,
        }),
      })

      if (response.ok) {
        // Atualizar o status local
        setMetropoles(prev => 
          prev.map(lead => 
            lead.id === leadId 
              ? { ...lead, field03: newStatus }
              : lead
          )
        )
        
        // Notificar o componente pai
        if (onStatusUpdate) {
          onStatusUpdate()
        }
      } else {
        throw new Error("Falha ao atualizar status")
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Erro ao atualizar status. Tente novamente.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleViewDetails = (leadId: number) => {
    router.push(`/dashboard/detail/${leadId}`)
  }

  const handleRefresh = () => {
    fetchMetropoles()
  }

  // Filtros
  useEffect(() => {
    const filteredData = metropoles.filter(lead => {
      const searchLower = searchTerm.toLowerCase()
      
      return (
        (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
        (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
        (lead.cellPhone && lead.cellPhone.includes(searchTerm)) ||
        (lead.interessePrincipal && lead.interessePrincipal.toLowerCase().includes(searchLower))
      )
    })

    // Calcular paginação
    const totalItems = filteredData.length
    const pages = Math.ceil(totalItems / itemsPerPage)
    setTotalPages(pages)
    
    // Ajustar página atual se necessário
    if (currentPage > pages && pages > 0) {
      setCurrentPage(1)
    }
  }, [metropoles, searchTerm, currentPage, itemsPerPage])

  // Dados para a página atual
  const getCurrentPageItems = () => {
    const filteredData = metropoles.filter(lead => {
      const searchLower = searchTerm.toLowerCase()
      
      return (
        (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
        (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
        (lead.cellPhone && lead.cellPhone.includes(searchTerm)) ||
        (lead.interessePrincipal && lead.interessePrincipal.toLowerCase().includes(searchLower))
      )
    })

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }

  // Função para formatar data de forma mais legível
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      
      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return "Data inválida"
      }
      
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      
      // Se foi há menos de 24 horas
      if (diffInHours < 24 && diffInHours >= 0) {
        if (diffInHours < 1) {
          const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
          if (diffInMinutes < 1) {
            return "Agora mesmo"
          }
          return `${diffInMinutes}min atrás`
        }
        return `${Math.floor(diffInHours)}h atrás`
      }
      
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      // Resetar horas para comparação de datas
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      
      if (dateOnly.getTime() === todayOnly.getTime()) {
        return `Hoje, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return `Ontem, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
      } else {
        // Para datas mais antigas, mostrar data completa
        return `${date.toLocaleDateString("pt-BR", { 
          day: "2-digit", 
          month: "2-digit",
          year: "2-digit"
        })}, ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
      }
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return "Data inválida"
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="bg-white text-gray-900 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Home className="h-6 w-6" />
                Leads Shalom Consórcios
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base">
                Gerencie seus leads de consórcios e imóveis. Ordenado por mais recentes.
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="self-start sm:self-auto">
              <Plus className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Filtros e Busca - Simplificados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Produto</label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.name || prod.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, telefone ou interesse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">Total</p>
                  <p className="text-lg font-bold text-blue-900">{metropoles.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Qualificados</p>
                  <p className="text-lg font-bold text-green-900">
                    {metropoles.filter(l => l.field03 === "QUALIFICADO" || l.field03 === "QUALIFICADO_OP").length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-yellow-600 font-medium">Novos</p>
                  <p className="text-lg font-bold text-yellow-900">
                    {metropoles.filter(l => !l.field03 || l.field03 === "NOVO").length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-teal-600" />
                <div>
                  <p className="text-xs text-teal-600 font-medium">Fechados</p>
                  <p className="text-lg font-bold text-teal-900">
                    {metropoles.filter(l => l.field03 === "FECHADO").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Tabela Desktop */}
              <div className="hidden xl:block">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interesse</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPageItems().map((lead) => {
                        const currentStatus = LEAD_STATUS.find((s) => s.value === lead.field03) || LEAD_STATUS[0]

                        return (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.name || "Nome não informado"}
                                </div>
                                <div className="text-sm text-gray-500">ID: {lead.id}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs">{lead.email || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs">{lead.cellPhone || "N/A"}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.interessePrincipal || "Não especificado"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Select
                                value={lead.field03 || "NOVO"}
                                onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                                disabled={updatingId === lead.id}
                              >
                                <SelectTrigger className="w-36">
                                  <SelectValue>
                                    <Badge variant="outline" className={`${currentStatus.color} text-white text-xs`}>
                                      {currentStatus.label}
                                    </Badge>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {LEAD_STATUS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                      <Badge variant="outline" className={`${status.color} text-white text-xs`}>
                                        {status.label}
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(lead.createdAt)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(lead.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {lead.cellPhone && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleWhatsAppClick(lead.cellPhone, lead.name)}
                                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white border-green-600"
                                    title="Enviar WhatsApp"
                                  >
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cards Mobile */}
              <div className="xl:hidden">
                <div className="space-y-4">
                  {getCurrentPageItems().map((lead) => {
                    const currentStatus = LEAD_STATUS.find((s) => s.value === lead.field03) || LEAD_STATUS[0]

                    return (
                      <Card key={lead.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header com nome e data */}
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{lead.name || "Nome não informado"}</h3>
                                <p className="text-xs text-gray-500">{lead.email || "Email não informado"}</p>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(lead.createdAt)}
                              </div>
                            </div>

                            {/* Interesse */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">Interesse:</span>
                                <span className="text-xs text-gray-900">
                                  {lead.interessePrincipal || "Não especificado"}
                                </span>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-600">Status</label>
                              <Select
                                value={lead.field03 || "NOVO"}
                                onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                                disabled={updatingId === lead.id}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue>
                                    <Badge variant="outline" className={`${currentStatus.color} text-white text-xs`}>
                                      {currentStatus.label}
                                    </Badge>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {LEAD_STATUS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                      <Badge variant="outline" className={`${status.color} text-white text-xs`}>
                                        {status.label}
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(lead.id)}
                                  className="h-8"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver
                                </Button>
                                {lead.cellPhone && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleWhatsAppClick(lead.cellPhone, lead.name)}
                                    className="h-8 bg-green-600 hover:bg-green-700 text-white border-green-600"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    WhatsApp
                                  </Button>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {lead.id}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
