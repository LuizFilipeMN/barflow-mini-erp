import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../services/firebase'

export const FormasPagamentoContext = createContext()

export const FormasPagamentoProvider = ({ children }) => {
  const [formasPagamento, setFormasPagamento] = useState([])

  useEffect(() => {
    carregarFormasPagamento()
  }, [])

  const carregarFormasPagamento = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'formas_pagamento'))
      const lista = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      setFormasPagamento(lista)
    } catch (e) {
      console.error('Erro ao carregar formas de pagamento do Firebase:', e)
    }
  }

  const adicionarForma = async (forma) => {
    try {
      const { id: _, ...formaSemId } = forma
      const docRef = await addDoc(collection(db, 'formas_pagamento'), formaSemId)
      const novaForma = { ...formaSemId, id: docRef.id }
      setFormasPagamento(prev => [...prev, novaForma])
    } catch (e) {
      console.error('Erro ao adicionar forma de pagamento:', e)
    }
  }

  const editarForma = async (formaAtualizada) => {
    try {
      if (!formaAtualizada?.id) {
        throw new Error('ID da forma de pagamento ausente ao tentar editar.')
      }
      const ref = doc(db, 'formas_pagamento', formaAtualizada.id)
      await updateDoc(ref, {
        ...formaAtualizada,
        id: formaAtualizada.id
      })
      setFormasPagamento(prev =>
        prev.map(f => (f.id == formaAtualizada.id ? formaAtualizada : f))
      )
    } catch (e) {
      console.error('Erro ao editar forma de pagamento:', e)
    }
  }

  const excluirForma = async (id) => {
    try {
      await deleteDoc(doc(db, 'formas_pagamento', id))
      setFormasPagamento(prev => prev.filter(f => f.id !== id))
    } catch (e) {
      console.error('Erro ao excluir forma de pagamento:', e)
    }
  }

  return (
    <FormasPagamentoContext.Provider
      value={{
        formasPagamento,
        adicionarForma,
        editarForma,
        excluirForma
      }}
    >
      {children}
    </FormasPagamentoContext.Provider>
  )
}

export const useFormasPagamento = () => useContext(FormasPagamentoContext)
