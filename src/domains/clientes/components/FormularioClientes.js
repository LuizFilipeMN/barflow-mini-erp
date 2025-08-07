import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useMemo, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { ClientesContext } from '../../../context/ClientesContext'
import BaseLayout from '../../shared/BaseLayout'

const FormularioClientes = () => {
  const { adicionarCliente, editarCliente } = useContext(ClientesContext)
  const { cliente } = useLocalSearchParams()
  const router = useRouter()

  const clienteObj = useMemo(() => {
    try {
      return cliente ? JSON.parse(cliente) : null
    } catch {
      return null
    }
  }, [cliente])

  const [editando, setEditando] = useState(false)
  const [id, setId] = useState(null)
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [erros, setErros] = useState({})

  useEffect(() => {
    if (clienteObj) {
      setEditando(true)
      setId(clienteObj.id)
      setNome(clienteObj.nome || '')
      setDocumento(clienteObj.documento || '')
      setTelefone(clienteObj.telefone || '')
      setEndereco(clienteObj.endereco || '')
    }
  }, [clienteObj])

  const formatarDocumento = (valor) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length <= 11) {
      return numeros
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2')
    } else {
      return numeros
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
  }

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
  }

  // 🛠️ Todos os campos opcionais
  const validarCampos = () => {
    setErros({})
    return true
  }

  const salvar = () => {
    if (!validarCampos()) return

    const novoCliente = {
      id,
      nome: nome.trim() || 'Consumidor',
      documento: documento.trim(),
      telefone: telefone.trim(),
      endereco: endereco.trim()
    }

    if (editando) {
      editarCliente(novoCliente)
    } else {
      adicionarCliente(novoCliente)
    }

    router.replace('/clientes')
  }

  return (
    <BaseLayout titulo={editando ? 'Editar cliente' : 'Adicionar cliente'}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder="CPF ou CNPJ"
              value={documento}
              onChangeText={(texto) => setDocumento(formatarDocumento(texto))}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={telefone}
              onChangeText={(texto) => setTelefone(formatarTelefone(texto))}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Endereço"
              value={endereco}
              onChangeText={setEndereco}
            />

            <View style={styles.botoes}>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => router.replace('/clientes')}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 5,
    borderRadius: 6
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  textoBotaoSalvar: {
    color: '#fff',
    fontWeight: 'bold'
  },
  textoBotaoCancelar: {
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default FormularioClientes
