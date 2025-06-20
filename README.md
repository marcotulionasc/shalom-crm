# Shalom Consórcios CRM

Sistema de gestão de leads especializado para consórcios e imóveis.

## 🏗️ Características

- **Design Responsivo**: Interface adaptada para desktop, tablet e mobile
- **Gestão de Leads**: Controle completo do funil de vendas
- **Dashboard Inteligente**: Métricas e estatísticas em tempo real
- **Integração WhatsApp**: Contato direto com leads
- **Filtros Avançados**: Busca por nome, email, telefone e interesse
- **Status Personalizados**: Funil de vendas adaptado para consórcios

## 🚀 Tecnologias

- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis
- **Lucide React**: Ícones

## 📊 Status de Leads

- **Novo**: Lead recém-cadastrado
- **Contato Feito**: Primeiro contato realizado
- **Qualificado**: Lead com potencial confirmado
- **Não Qualificado**: Lead sem fit
- **Qualificado OP**: Lead qualificado para oportunidade
- **Proposta**: Proposta enviada
- **Fechado**: Negócio concluído

## 🔧 Configuração

### Variáveis de Ambiente

```env
TENANT_ID=7
API_BASE_URL=https://backend-ingressar.onrender.com/metropole/v1
PRODUCT_ID=shalomconsorcios
```

### Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📱 Funcionalidades

### Dashboard Principal
- Métricas de conversão
- Leads por interesse
- Taxa de qualificação

### Gestão de Leads
- Lista completa de leads
- Busca e filtros
- Atualização de status
- Visualização detalhada

### Integração WhatsApp
- Template personalizável
- Mensagem automática com nome do lead
- Abertura direta no WhatsApp

## 🎨 Design System

### Cores da Shalom
- **Primary**: `rgb(139, 69, 19)` (Marrom)
- **Secondary**: `rgb(255, 193, 7)` (Amarelo)
- **Accent**: `rgb(255, 215, 0)` (Dourado)

### Componentes
- Cards responsivos
- Tabelas adaptáveis
- Formulários validados
- Modais interativos

## 📊 API Integration

### Endpoints Utilizados

**Listar Leads**
```
GET /metropole/v1/data/7/shalomconsorcios
```

**Atualizar Status**
```
PUT /metropole/v1/update/{leadId}
Body: { "field03": "STATUS" }
```

### Estrutura de Dados

```typescript
interface ShalomLead {
  id: number
  name: string
  email: string
  cellPhone: string
  field01: string      // Campo customizado
  field02: string      // Campo customizado
  field03: string      // Status do lead
  interessePrincipal: string
  createdAt: string
  updatedAt: string
  // ... outros campos
}
```

## 🔄 White Label

Este sistema utiliza a mesma estrutura visual do CRM Metropole, adaptado especificamente para:

- **Dados da Shalom**: Tenant ID 7, produto 'shalomconsorcios'
- **Cores da marca**: Esquema marrom/amarelo
- **Terminologia**: Focada em consórcios e imóveis
- **Campos específicos**: Interesse principal

## 📈 Métricas Disponíveis

- Total de leads
- Leads qualificados
- Propostas em andamento
- Negócios fechados
- Taxa de conversão
- Distribuição por interesse

## 🎯 Público-Alvo

Sistema desenvolvido para:
- Corretoras de consórcios
- Consórcioss
- Consultores de vendas
- Profissionais autônomos

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato através dos canais oficiais da Shalom Consórcios.

---

**Shalom Consórcios CRM** - Transformando leads em negócios realizados.
