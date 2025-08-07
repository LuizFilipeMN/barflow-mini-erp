import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'

const AutoCompleteInput = ({
  label,
  placeholder,
  dados = [],
  campoChave = 'id',
  campoLabel = 'nome',
  valorInicial = '',
  onSelecionar = () => {},
  onChangeText = () => {},
  erro,
  desabilitarSugestoes = false
}) => {
  const [valor, setValor] = useState(valorInicial || '')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateYAnim = useRef(new Animated.Value(-10)).current

  const filtrados = dados.filter(item =>
    typeof valor === 'string' &&
    item[campoLabel]?.toLowerCase().includes(valor.toLowerCase())
  )

  const animarSugestoes = (exibir) => {
    Animated.timing(fadeAnim, {
      toValue: exibir ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start()

    Animated.timing(translateYAnim, {
      toValue: exibir ? 0 : -10,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  const selecionarItem = (item) => {
    setValor(item[campoLabel])
    setMostrarSugestoes(false)
    animarSugestoes(false)
    Keyboard.dismiss()
    onSelecionar(item)
  }

  const handleChange = (text) => {
    setValor(text)
    onChangeText(text)

    if (!desabilitarSugestoes && !mostrarSugestoes) {
      setMostrarSugestoes(true)
      animarSugestoes(true)
    }
  }

  useEffect(() => {
    if (valorInicial) setValor(valorInicial)
  }, [valorInicial])

  return (
    <TouchableWithoutFeedback onPress={() => {
      setMostrarSugestoes(false)
      Keyboard.dismiss()
    }}>
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TextInput
          style={[styles.input, erro && styles.erroBorda]}
          placeholder={placeholder}
          value={valor}
          onFocus={() => {
            if (!desabilitarSugestoes) {
              setMostrarSugestoes(true)
              animarSugestoes(true)
            }
          }}
          onChangeText={handleChange}
          autoCapitalize="none"
        />

        {erro && <Text style={styles.erroTexto}>{erro}</Text>}

        {!desabilitarSugestoes && mostrarSugestoes && (
          <Animated.View
            style={[
              styles.sugestoes,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }]
              }
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              style={{ maxHeight: 200 }}
            >
              {filtrados.length > 0 ? (
                filtrados.slice(0, 10).map(item => (
                  <TouchableOpacity
                    key={item[campoChave]}
                    style={styles.itemSugestao}
                    onPress={() => selecionarItem(item)}
                  >
                    <Text>{item[campoLabel]} (ID {item[campoChave]})</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.vazio}>Nenhum item encontrado</Text>
              )}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16
  },
  erroBorda: {
    borderColor: 'red'
  },
  erroTexto: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4
  },
  sugestoes: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  itemSugestao: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  vazio: {
    padding: 10,
    color: '#999',
    fontStyle: 'italic'
  }
})

export default AutoCompleteInput