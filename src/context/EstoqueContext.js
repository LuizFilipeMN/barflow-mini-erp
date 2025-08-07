import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { ProdutosContext } from './ProdutosContext'

export const EstoqueContext = createContext()

export const EstoqueProvider = ({ children }) => {
  const { adicionarEntradaAoProduto, adicionarSaidaAoProduto } = useContext(ProdutosContext)
  const [historico, setHistorico] = useState([])

  useEffect(() => {
    carregarHistorico()
  }, [])

  const carregarHistorico = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'estoque_historico'), orderBy('data', 'desc'))
      )
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setHistorico(lista)
    } catch (e) {
      console.error('Erro ao carregar histórico do estoque:', e)
    }
  }

  const registrarEntrada = async ({ produtoId, quantidade, origem = 'Entrada manual' }) => {
    const qtd = Number(quantidade)
    if (!produtoId || isNaN(qtd) || qtd <= 0) {
      console.warn('Dados inválidos em registrarEntrada:', { produtoId, quantidade })
      return
    }

    await adicionarEntradaAoProduto(produtoId, qtd)
    await registrarHistorico({ tipo: 'entrada', produtoId, quantidade: qtd, origem })
  }

  const registrarSaida = async ({ produtoId, quantidade, origem = 'Saída manual' }) => {
    const qtd = Number(quantidade)
    if (!produtoId || isNaN(qtd) || qtd <= 0) {
      console.warn('Dados inválidos em registrarSaida:', { produtoId, quantidade })
      return
    }

    await adicionarSaidaAoProduto(produtoId, qtd)
    await registrarHistorico({ tipo: 'saída', produtoId, quantidade: qtd, origem })
  }

  const registrarHistorico = async ({ tipo, produtoId, quantidade, origem }) => {
    try {
      const novaMovimentacao = {
        tipo,
        produtoId,
        quantidade,
        origem,
        data: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'estoque_historico'), novaMovimentacao)

      setHistorico(prev => [{ id: docRef.id, ...novaMovimentacao }, ...prev])
    } catch (e) {
      console.error('Erro ao registrar histórico de estoque:', e)
    }
  }

  const getMovimentacoesPorProduto = (produtoId) => {
    return historico.filter(h => h.produtoId == produtoId)
  }

  const calcularEstoque = (produtoId) => {
    if (!produtoId) return { entradas: 0, saidas: 0 }

    const entradas = historico
      .filter(h => h.produtoId == produtoId && h.tipo == 'entrada')
      .reduce((acc, h) => acc + Number(h.quantidade || 0), 0)

    const saidas = historico
      .filter(h => h.produtoId == produtoId && h.tipo == 'saída')
      .reduce((acc, h) => acc + Number(h.quantidade || 0), 0)

    return { entradas, saidas }
  }

  return (
    <EstoqueContext.Provider
      value={{
        registrarEntrada,
        registrarSaida,
        historico,
        calcularEstoque,
        getMovimentacoesPorProduto
      }}
    >
      {children}
    </EstoqueContext.Provider>
  )
}