import { useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
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
import { TextInputMask } from 'react-native-masked-text'
import { AuthContext } from '../../../context/AuthContext'
import BaseLayout from '../../shared/BaseLayout'

export default function FormularioCadastro() {
  const router = useRouter()
  const { register } = useContext(AuthContext)

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const realizarCadastro = async () => {
    if (!nome || !telefone || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }

    setCarregando(true)
    try {
      await register({ email, senha, nome, telefone })
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!')
      router.replace('/login')
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <BaseLayout titulo="Cadastro">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              value={telefone}
              onChangeText={setTelefone}
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="(99) 99999-9999"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="Digite uma senha"
            />

            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={realizarCadastro}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoBotaoSalvar}>Cadastrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.link}>Já possui conta? Faça login</Text>
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
    flexGrow: 1
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginTop: 4
  },
  botoes: {
    marginTop: 30,
    gap: 15
  },
  botaoSalvar: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  textoBotaoSalvar: {
    color: '#fff',
    fontWeight: 'bold'
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 8
  }
})