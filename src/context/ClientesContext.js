import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import { db } from '../services/firebase' 

export const ClientesContext = createContext()

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'clientes'))
      const lista = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      setClientes(lista)
    } catch (e) {
      console.error('Erro ao carregar clientes do Firebase:', e)
    }
  }

  const adicionarCliente = async (cliente) => {
    try {
      const clienteFormatado = {
        nome: cliente.nome?.trim() || 'Consumidor',
        documento: cliente.documento?.trim() || '',
        telefone: cliente.telefone?.trim() || ''
      }
      const docRef = await addDoc(collection(db, 'clientes'), clienteFormatado)
      const novoCliente = { id: docRef.id, ...clienteFormatado }
      setClientes(prev => [...prev, novoCliente])
    } catch (e) {
      console.error('Erro ao adicionar cliente:', e)
    }
  }

  const editarCliente = async (clienteEditado) => {
    try {
      if (!clienteEditado?.id) throw new Error('ID do cliente ausente.')
      const ref = doc(db, 'clientes', clienteEditado.id)
      await updateDoc(ref, {
        nome: clienteEditado.nome?.trim() || 'Consumidor',
        documento: clienteEditado.documento?.trim() || '',
        telefone: clienteEditado.telefone?.trim() || ''
      })
      setClientes(prev =>
        prev.map(c => (c.id === clienteEditado.id ? clienteEditado : c))
      )
    } catch (e) {
      console.error('Erro ao editar cliente:', e)
    }
  }

  const excluirCliente = async (id) => {
    try {
      await deleteDoc(doc(db, 'clientes', id))
      setClientes(prev => prev.filter(c => c.id !== id))
    } catch (e) {
      console.error('Erro ao excluir cliente:', e)
    }
  }

  return (
    <ClientesContext.Provider value={{ clientes, adicionarCliente, editarCliente, excluirCliente }}>
      {children}
    </ClientesContext.Provider>
  )
}
