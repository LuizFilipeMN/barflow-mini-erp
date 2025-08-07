import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import {
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
import { ProdutosContext } from '../../../context/ProdutosContext'
import BaseLayout from '../../shared/BaseLayout'

export default function FormularioProduto() {
  const router = useRouter()
  const { produto } = useLocalSearchParams()
  const { adicionarProduto, editarProduto } = useContext(ProdutosContext)

  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [valorCusto, setValorCusto] = useState('R$ 0,00')
  const [valorVenda, setValorVenda] = useState('R$ 0,00')
  const [erros, setErros] = useState({})
  const [editando, setEditando] = useState(false)
  const [id, setId] = useState(null)

  useEffect(() => {
    try {
      if (produto && typeof produto === 'string' && produto.includes('{')) {
        const obj = JSON.parse(produto)
        setEditando(true)
        setId(obj.id)
        setCodigo(obj.codigo || '')
        setNome(obj.nome || '')
        setQuantidade(obj.quantidade?.toString() || '')
        setValorCusto(formatarNumeroParaMoeda(obj.valorCusto || 0))
        setValorVenda(formatarNumeroParaMoeda(obj.valorVenda || 0))
      }
    } catch (e) {
      console.error('Erro ao carregar produto para edição:', e)
    }
  }, [produto])

  const formatarParaReal = (valor) => {
    const somenteNumeros = valor.toString().replace(/[^\d]/g, '')
    const valorNumerico = parseFloat(somenteNumeros) / 100
    return valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatarNumeroParaMoeda = (valor) => {
    const numero = Number(valor)
    if (isNaN(numero)) return 'R$ 0,00'
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }


  const validarCampos = () => {
    const novosErros = {}

    if (!codigo.trim()) novosErros.codigo = 'Informe o código do produto'
    if (!nome.trim()) novosErros.nome = 'Informe o nome do produto'
    if (!quantidade || isNaN(quantidade) || Number(quantidade) <= 0)
      novosErros.quantidade = 'Informe uma quantidade válida'
    if (!valorCusto || valorCusto == 'R$ 0,00')
      novosErros.valorCusto = 'Informe um valor de custo válido'
    if (!valorVenda || valorVenda == 'R$ 0,00')
      novosErros.valorVenda = 'Informe um valor de venda válido'

    setErros(novosErros)
    return Object.keys(novosErros).length == 0
  }

  const salvarProduto = async () => {
    if (!validarCampos()) return

    const novoProduto = {
      id,
      codigo,
      nome,
      quantidade: Number(quantidade),
      valorCusto: Number((valorCusto || '').replace(/\D/g, '')) / 100,
      valorVenda: Number((valorVenda || '').replace(/\D/g, '')) / 100
    }

    try {
      if (editando) {
        await editarProduto(novoProduto)
      } else {
        await adicionarProduto(novoProduto)
      }

      Alert.alert('Sucesso', editando ? 'Produto editado com sucesso!' : 'Produto salvo com sucesso!')
      router.replace('/produtos')
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o produto.')
      console.error('Erro ao salvar produto:', e)
    }
  }

  return (
    <BaseLayout titulo={editando ? 'Editar Produto' : 'Cadastro de Produto'}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Código"
              value={codigo}
              onChangeText={setCodigo}
            />
            {erros.codigo && <Text style={styles.erro}>{erros.codigo}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={nome}
              onChangeText={setNome}
            />
            {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />
            {erros.quantidade && <Text style={styles.erro}>{erros.quantidade}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Valor de custo"
              value={valorCusto}
              onChangeText={(texto) => setValorCusto(formatarParaReal(texto))}
              keyboardType="numeric"
            />
            {erros.valorCusto && <Text style={styles.erro}>{erros.valorCusto}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Valor de venda"
              value={valorVenda}
              onChangeText={(texto) => setValorVenda(formatarParaReal(texto))}
              keyboardType="numeric"
            />
            {erros.valorVenda && <Text style={styles.erro}>{erros.valorVenda}</Text>}

            <View style={styles.botoes}>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProduto}>
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoCancelar} onPress={() => router.replace('/produtos')}>
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
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 5
  },
  erro: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
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