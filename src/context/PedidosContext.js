import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { ProdutosContext } from './ProdutosContext'


export const PedidosContext = createContext()

export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([])
  const { produtos, adicionarSaidaAoProduto } = useContext(ProdutosContext)

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = async () => {
    try {
      const pedidosRef = collection(db, 'pedidos')
      const q = query(pedidosRef, orderBy('dataVenda', 'desc'))
      const snapshot = await getDocs(q)
      const lista = snapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
        .filter(p => p && p.status && !isNaN(Number(p.valor)))
      setPedidos(lista)
    } catch (e) {
      console.error('Erro ao carregar pedidos do Firebase:', e)
    }
  }

  // const salvarPedidos = async (lista) => {
  //   try {
  //     await AsyncStorage.setItem('@pedidos', JSON.stringify(lista))
  //   } catch (e) {
  //     console.error('Erro ao salvar pedidos', e)
  //   }
  // }

  const realizarBaixaEstoque = (pedido) => {
    if (pedido.status == 'Concluída') {
      const produtoEncontrado = produtos.find(p => p.nome == pedido.produto)
      const toNumber = (valor) => Number(String(valor).replace(',', '.'))
      const quantidade = toNumber(pedido.quantidade)

      if (produtoEncontrado && !isNaN(quantidade) && quantidade > 0) {
        adicionarSaidaAoProduto(produtoEncontrado.id, quantidade)
      }
    }
  }

  const adicionarPedido = async (pedido) => {
    try {
      const { id, ...pedidoSemId } = pedido
      const novoPedido = {
        ...pedidoSemId,
        forma_pagamento: pedido.forma_pagamento || '',
        dataVenda: pedido.dataVenda || new Date().toISOString(),
        created_at: new Date().toISOString()
      }
      const docRef = await addDoc(collection(db, 'pedidos'), novoPedido)
      const pedidoComId = { ...novoPedido, id: docRef.id }
      setPedidos(prev => [...prev, pedidoComId])
      realizarBaixaEstoque(pedidoComId)
    } catch (e) {
      console.error('Erro ao adicionar pedido:', e)
    }
  }

  const editarPedido = async (pedidoEditado) => {
    if (!pedidoEditado.id) {
      console.error('ID do pedido ausente ao tentar editar.')
      return
    }

    try {
      const { id, ...dadosSemId } = pedidoEditado
      await updateDoc(doc(db, 'pedidos', id), dadosSemId)

      setPedidos(prev =>
        prev.map(p => (p.id === id ? pedidoEditado : p))
      )

      realizarBaixaEstoque(pedidoEditado)
    } catch (e) {
      console.error('Erro ao editar pedido:', e)
    }
  }

  const excluirPedido = async (id) => {
    try {
      await deleteDoc(doc(db, 'pedidos', id))
      setPedidos(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error('Erro ao excluir pedido:', e)
    }
  }

  return (
    <PedidosContext.Provider
      value={{ pedidos, adicionarPedido, editarPedido, excluirPedido }}
    >
      {children}
    </PedidosContext.Provider>
  )
}