import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { auth, db } from '../services/firebase'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user || null)
      setCarregando(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, senha) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha)
      const user = userCredential.user
      if (!user) throw new Error('Usuário inválido.')
      return true
    } catch (error) {
      Alert.alert('Erro', traduzErroFirebase(error.code))
      setUsuario(null)
      return false
    }
  }

  const register = async ({ email, senha, nome, telefone }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      const user = userCredential.user

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        email,
        nome,
        telefone,
        criado_em: new Date()
      })
    } catch (error) {
      Alert.alert('Erro', traduzErroFirebase(error.code))
      throw error
    }
  }

  const recuperarSenha = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      Alert.alert('Sucesso', 'Verifique sua caixa de entrada para redefinir a senha.')
    } catch (error) {
      Alert.alert('Erro', traduzErroFirebase(error.code))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.')
    }
  }

  const traduzErroFirebase = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado.'
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.'
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso.'
      case 'auth/invalid-email':
        return 'E-mail inválido.'
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.'
      default:
        return 'Erro desconhecido. Tente novamente.'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAutenticado: !!usuario,
        login,
        logout,
        register,
        recuperarSenha,
        carregando
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}