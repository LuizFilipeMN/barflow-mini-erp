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

export default function RecuperarSenha() {
  const router = useRouter()
  const { recuperarSenha } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(false)

  const enviarRecuperacao = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.')
      return
    }

    setCarregando(true)
    try {
      await recuperarSenha(email)
      router.replace('/login')
    } catch (error) {
      console.error('Erro ao enviar recuperação:', error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <BaseLayout titulo="Recuperar Senha">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
              <Text style={styles.titulo}>Recuperar Senha</Text>

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Digite seu e-mail"
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                style={styles.botao}
                onPress={enviarRecuperacao}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoBotao}>Enviar Instruções</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.link}>Voltar ao login</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  botao: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },
  link: {
    color: '#007bff',
    textAlign: 'center'
  }
})