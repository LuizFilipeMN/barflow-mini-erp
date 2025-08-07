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
import { AuthContext } from '../../../context/AuthContext'
import BaseLayout from '../../shared/BaseLayout'

export default function FormularioLogin() {
  const router = useRouter()
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const realizarLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Informe o e-mail e a senha.')
      return
    }

    setCarregando(true)
    try {
      const sucesso = await login(email, senha)
      if (sucesso) {
        router.replace('/home')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <BaseLayout titulo="Login">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Digite seu email"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="Digite sua senha"
            />

            <View style={styles.botoes}>
              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={realizarLogin}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoBotaoSalvar}>Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/cadastro/form')}>
                <Text style={styles.link}>Não possui conta? Cadastre-se</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/cadastro/recuperar-senha')}>
                <Text style={styles.link}>Esqueceu sua senha?</Text>
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
    backgroundColor: '#007bff',
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