import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const ProdutosContext = createContext()

export const ProdutosProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'produtos'))
      const lista = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      setProdutos(lista)
    } catch (e) {
      console.error('Erro ao carregar produtos do Firebase:', e)
    }
  }

  const adicionarProduto = async (produto) => {
    try {
      const { id: _, ...produtoSemId } = produto
      const docRef = await addDoc(collection(db, 'produtos'), produtoSemId)
      const novoProduto = { ...produtoSemId, id: docRef.id }
      setProdutos(prev => [...prev, novoProduto])
    } catch (e) {
      console.error('Erro ao adicionar produto:', e)
    }
  }

  const editarProduto = async (produtoEditado) => {
    try {
      if (!produtoEditado?.id) {
        throw new Error('ID do produto ausente ao tentar editar.')
      }
      const ref = doc(db, 'produtos', produtoEditado.id)
      await updateDoc(ref, {
        ...produtoEditado,
        id: produtoEditado.id
      })
      setProdutos(prev =>
        prev.map(p => (p.id == produtoEditado.id ? produtoEditado : p))
      )
    } catch (e) {
      console.error('Erro ao editar produto:', e)
    }
  }



  const excluirProduto = async (id) => {
    try {
      await deleteDoc(doc(db, 'produtos', id))
      setProdutos(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error('Erro ao excluir produto:', e)
    }
  }

  const adicionarEntradaAoProduto = async (produtoId, quantidade) => {
    try {
      const produto = produtos.find(p => p.id == produtoId)
      if (!produto) return

      const novaQuantidade = (produto.quantidade || 0) + Number(quantidade)
      await updateDoc(doc(db, 'produtos', produtoId), { quantidade: novaQuantidade })

      setProdutos(prev =>
        prev.map(p => (p.id == produtoId ? { ...p, quantidade: novaQuantidade } : p))
      )
    } catch (e) {
      console.error('Erro ao adicionar entrada no produto:', e)
    }
  }

  const adicionarSaidaAoProduto = async (produtoId, quantidade) => {
    try {
      const produto = produtos.find(p => p.id == produtoId)
      if (!produto) return

      const novaQuantidade = (produto.quantidade || 0) - Number(quantidade)
      await updateDoc(doc(db, 'produtos', produtoId), { quantidade: novaQuantidade })

      setProdutos(prev =>
        prev.map(p => (p.id == produtoId ? { ...p, quantidade: novaQuantidade } : p))
      )
    } catch (e) {
      console.error('Erro ao adicionar saída no produto:', e)
    }
  }

  return (
    <ProdutosContext.Provider
      value={{
        produtos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        adicionarEntradaAoProduto,
        adicionarSaidaAoProduto
      }}
    >
      {children}
    </ProdutosContext.Provider>
  )
}