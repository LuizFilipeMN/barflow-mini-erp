import { Picker } from '@react-native-picker/picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { FormasPagamentoContext } from '../../../context/FormasPagamentoContext'
import BaseLayout from '../../shared/BaseLayout'

const tipos = ['Selecione', 'Dinheiro', 'Cartão', 'Boleto', 'Pix', 'Outros']

export default function FormularioFormasPagamento() {
  const router = useRouter()
  const { forma } = useLocalSearchParams()
  const { adicionarForma, editarForma } = useContext(FormasPagamentoContext)

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Selecione')
  const [editando, setEditando] = useState(false)
  const [id, setId] = useState(null)
  const [erros, setErros] = useState({})
  const [mostrarPicker, setMostrarPicker] = useState(false)

  useEffect(() => {
    if (forma) {
      const obj = JSON.parse(forma)
      setEditando(true)
      setId(obj.id)
      setNome(obj.nome || '')
      setTipo(obj.tipo || 'Selecione')
    }
  }, [forma])

  const validarCampos = () => {
    const novosErros = {}
    if (!nome.trim()) novosErros.nome = 'Informe o nome da forma de pagamento'
    if (tipo == 'Selecione') novosErros.tipo = 'Selecione um tipo válido'
    setErros(novosErros)
    return Object.keys(novosErros).length == 0
  }

  const salvar = () => {
    if (!validarCampos()) return

    const novaForma = {
      nome,
      tipo
    }

    if (editando) {
      editarForma({ ...novaForma, id })
    } else {
      adicionarForma(novaForma)
    }

    router.replace('/formas_pagamento')
  }

  return (
    <BaseLayout titulo={editando ? 'Editar forma de pagamento' : 'Nova forma de pagamento'}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Nome da forma de pagamento"
              value={nome}
              onChangeText={setNome}
            />
            {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

            <Text style={{ marginBottom: 5 }}>Tipo</Text>
            <TouchableOpacity
              onPress={() => setMostrarPicker(true)}
              style={styles.input}
            >
              <Text style={{ color: tipo == 'Selecione' ? '#999' : '#000' }}>
                {tipo}
              </Text>
            </TouchableOpacity>
            {erros.tipo && <Text style={styles.erro}>{erros.tipo}</Text>}

            <Modal
              visible={mostrarPicker}
              transparent={true}
              animationType="slide"
            >
              <TouchableWithoutFeedback onPress={() => setMostrarPicker(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Picker
                      selectedValue={tipo}
                      onValueChange={(itemValue) => {
                        setTipo(itemValue)
                        setMostrarPicker(false)
                      }}
                    >
                      {tipos.map((opcao, index) => (
                        <Picker.Item key={index} label={opcao} value={opcao} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View style={styles.botoes}>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => router.replace('/formas_pagamento')}
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
  erro: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }
})