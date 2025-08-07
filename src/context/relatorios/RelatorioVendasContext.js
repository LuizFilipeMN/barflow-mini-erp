import { createContext, useContext, useEffect, useState } from 'react'
import { PedidosContext } from '../PedidosContext'

const RelatorioVendasContext = createContext()

export const RelatorioVendasProvider = ({ children }) => {
  const [filtros, setFiltros] = useState({
    cliente: '',
    produto: '',
    formaPagamento: '',
    dataInicio: '',
    dataFim: ''
  })

  const [resultado, setResultado] = useState([])
  const { pedidos } = useContext(PedidosContext)

  const aplicarFiltros = (novosFiltros = filtros) => {
    setFiltros(novosFiltros)

    const parseDataFiltro = (dataIso) => {
      if (!dataIso) return null
      return new Date(dataIso)
    }

    const dataInicio = parseDataFiltro(novosFiltros.dataInicio)
    const dataFim = parseDataFiltro(novosFiltros.dataFim)
    const statusSelecionados = novosFiltros.status || []

    const pedidosFiltrados = pedidos.filter(p => {
      const clienteOK = !novosFiltros.cliente || p.cliente?.toLowerCase().includes(novosFiltros.cliente.toLowerCase())
      const produtoOK = !novosFiltros.produto || p.produto?.toLowerCase().includes(novosFiltros.produto.toLowerCase())
      const formaPagamentoOK = !novosFiltros.formaPagamento || p.forma_pagamento?.toLowerCase().includes(novosFiltros.formaPagamento.toLowerCase())
      const dataPedido = new Date(p.dataVenda || p.created_at)
      const dataInicioOK = !dataInicio || dataPedido >= dataInicio
      const dataFimOK = !dataFim || dataPedido <= dataFim
      const statusOK = statusSelecionados.length == 0 || statusSelecionados.includes(p.status)

      return clienteOK && produtoOK && formaPagamentoOK && dataInicioOK && dataFimOK && statusOK
    })

    const resultadosFormatados = pedidosFiltrados.map(p => {
      const valorUnitario = Number(p.valor) || 0
      const quantidade = Number(p.quantidade) || 1
      const valorTotal = valorUnitario * quantidade
      const dataVenda = new Date(p.dataVenda || p.created_at)

      return {
        codigo: String(p.id).padStart(3, '0'),
        cliente: p.cliente,
        produto: p.produto,
        quantidade: p.quantidade,
        valorProduto: valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        formaPagamento: p.forma_pagamento?.trim() || '-',
        formaPagamentoKey: p.forma_pagamento?.toLowerCase().trim() || '-',
        valorTotal: valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        valorTotalBruto: valorTotal,
        data: dataVenda.toLocaleDateString('pt-BR')
      }
    })

    setResultado(resultadosFormatados)
  }

  useEffect(() => {
    aplicarFiltros(filtros)
  }, [pedidos])

  return (
    <RelatorioVendasContext.Provider
      value={{
        filtros,
        setFiltros,
        aplicarFiltros,
        resultado,
        setResultado
      }}
    >
      {children}
    </RelatorioVendasContext.Provider>
  )
}

export const useRelatorioVendas = () => useContext(RelatorioVendasContext)