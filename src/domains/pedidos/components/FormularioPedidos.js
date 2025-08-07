import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
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
import { ClientesContext } from '../../../context/ClientesContext'
import { EstoqueContext } from '../../../context/EstoqueContext'
import { FormasPagamentoContext } from '../../../context/FormasPagamentoContext'
import { PedidosContext } from '../../../context/PedidosContext'
import { ProdutosContext } from '../../../context/ProdutosContext'
import AutoCompleteInput from '../../shared/AutoCompleteInput'
import BaseLayout from '../../shared/BaseLayout'

const statusVendas = [
  { id: 1, nome: 'Em aberto' },
  { id: 2, nome: 'Em andamento' },
  { id: 3, nome: 'Concluída' },
  { id: 4, nome: 'Cancelada' },
  { id: 5, nome: 'Fiado' }
]

const FormularioPedidos = () => {
  const { adicionarPedido, editarPedido } = useContext(PedidosContext)
  const { clientes } = useContext(ClientesContext)
  const { produtos } = useContext(ProdutosContext)
  const { formasPagamento } = useContext(FormasPagamentoContext)
  const { registrarSaida } = useContext(EstoqueContext)

  const { pedido } = useLocalSearchParams()
  const router = useRouter()

  const [cliente, setCliente] = useState('')
  const [produto, setProduto] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [pagamento, setPagamento] = useState('')
  const [valor, setValor] = useState('R$ 0,00')
  const [status, setStatus] = useState('')
  const [editando, setEditando] = useState(false)
  const [id, setId] = useState(null)
  const [statusAnterior, setStatusAnterior] = useState('')
  const [erros, setErros] = useState({})
  const [dataVenda, setDataVenda] = useState(new Date())
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false)
  const [modalStatusVisivel, setModalStatusVisivel] = useState(false)

  useEffect(() => {
    if (pedido) {
      try {
        const obj = JSON.parse(pedido)
        setEditando(true)
        setId(obj.id)
        setCliente(obj.cliente)
        setProduto(obj.produto || '')
        setQuantidade(obj.quantidade?.toString() || '')
        setPagamento(obj.pagamento || '')
        setValor(formatarParaReal(obj.valor || 0))
        setStatus(obj.status || '')
        setStatusAnterior(obj.status || '')
        if (obj.dataVenda) {
          setDataVenda(new Date(obj.dataVenda))
        }
      } catch (e) {
        console.error('Erro ao carregar pedido:', e)
      }
    }
  }, [pedido])

  const formatarParaReal = (valor) => {
    if (typeof valor == 'number') valor = valor.toFixed(2)
    const numeros = valor.toString().replace(/[^\d]/g, '')
    const valorNumerico = parseFloat(numeros) / 100
    return valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const normalizarQuantidade = (qtd) => Number(String(qtd).replace(',', '.'))
  const normalizarValor = (val) => Number(val.replace(/\D/g, '')) / 100

  const validarCampos = () => {
    const novosErros = {}
    const qtd = normalizarQuantidade(quantidade)

    if (!cliente.trim()) novosErros.cliente = 'Informe o nome do cliente'
    if (!produto.trim()) novosErros.produto = 'Informe o produto'
    if (!quantidade || isNaN(qtd) || qtd <= 0) novosErros.quantidade = 'Informe uma quantidade válida'
    if (!pagamento.trim()) novosErros.pagamento = 'Informe a forma de pagamento'
    if (!valor || valor == 'R$ 0,00') novosErros.valor = 'Informe um valor válido'
    if (!status.trim()) novosErros.status = 'Selecione o status da venda'

    setErros(novosErros)
    return Object.keys(novosErros).length == 0
  }

  const salvar = () => {
    if (!validarCampos()) return

    const produtoSelecionado = produtos.find(p => p.nome == produto)

    const novoPedido = {
      id,
      cliente,
      produto,
      quantidade: normalizarQuantidade(quantidade),
      pagamento,
      valor: normalizarValor(valor),
      dataVenda: dataVenda.toISOString(),
      forma_pagamento: pagamento,
      status
    }

    const deveRegistrarSaida =
      status == 'Concluída' && statusAnterior !== 'Concluída' && produtoSelecionado

    if (editando) {
      editarPedido(novoPedido)

      if (deveRegistrarSaida) {
        registrarSaida({
          produtoId: produtoSelecionado.id,
          produtoNome: produtoSelecionado.nome,
          quantidade: normalizarQuantidade(quantidade),
          origem: 'Venda concluída (edição)'
        })
      }

    } else {
      adicionarPedido(novoPedido)

      if (status == 'Concluída' && produtoSelecionado) {
        registrarSaida({
          produtoId: produtoSelecionado.id,
          produtoNome: produtoSelecionado.nome,
          quantidade: normalizarQuantidade(quantidade),
          origem: 'Venda concluída'
        })
      }
    }

    router.replace('/pedidos')
  }

  return (
    <BaseLayout titulo={editando ? 'Editar venda' : 'Adicionar venda'}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ ...styles.container, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <AutoCompleteInput
              label="Cliente"
              placeholder="Digite o nome do cliente"
              dados={clientes}
              campoChave="id"
              campoLabel="nome"
              valorInicial={cliente}
              onSelecionar={(item) => setCliente(item.nome)}
            />
            {erros.cliente && <Text style={styles.erro}>{erros.cliente}</Text>}

            <AutoCompleteInput
              label="Produto"
              placeholder="Digite o nome do produto"
              dados={produtos}
              campoChave="id"
              campoLabel="nome"
              valorInicial={produto}
              onSelecionar={(item) => setProduto(item.nome)}
            />
            {erros.produto && <Text style={styles.erro}>{erros.produto}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              value={quantidade}
              onChangeText={(texto) => {
                const numeros = texto.replace(/[^\d]/g, '')
                const numero = parseFloat(numeros) / 100
                setQuantidade(numero.toFixed(2).replace('.', ','))
              }}
              keyboardType="numeric"
            />
            {erros.quantidade && <Text style={styles.erro}>{erros.quantidade}</Text>}

            <AutoCompleteInput
              label="Forma de pagamento"
              placeholder="Digite a forma de pagamento"
              dados={formasPagamento}
              campoChave="id"
              campoLabel="nome"
              valorInicial={pagamento}
              onSelecionar={(item) => setPagamento(item.nome)}
            />
            {erros.pagamento && <Text style={styles.erro}>{erros.pagamento}</Text>}
              
            <TextInput
              style={styles.input}
              placeholder="Valor total"
              value={valor}
              onChangeText={(texto) => {
                const numeros = texto.replace(/[^\d]/g, '')
                const numero = parseFloat(numeros) / 100
                setValor(formatarParaReal(numero))
              }}
              keyboardType="numeric"
            />
            {erros.valor && <Text style={styles.erro}>{erros.valor}</Text>}
            
            <Text style={styles.label}>Data da venda</Text>
            <TouchableOpacity onPress={() => setMostrarDataPicker(true)} style={styles.input}>
              <Text>{format(dataVenda, 'dd/MM/yyyy')}</Text>
            </TouchableOpacity>

            {mostrarDataPicker && (
              <DateTimePicker
                value={dataVenda}
                placeholder="Selecione a data"
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setMostrarDataPicker(false)
                  if (selectedDate) setDataVenda(selectedDate)
                }}
              />
            )}

            <Text style={styles.label}>Status da venda</Text>
            <TouchableOpacity
              style={[styles.input, styles.picker]}
              onPress={() => setModalStatusVisivel(true)}
            >
              <Text style={{ color: status ? '#000' : '#999' }}>
                {status || 'Selecione o status'}
              </Text>
            </TouchableOpacity>
            {erros.status && <Text style={styles.erro}>{erros.status}</Text>}

            <Modal
              visible={modalStatusVisivel}
              transparent
              animationType="slide"
              onRequestClose={() => setModalStatusVisivel(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalStatusVisivel(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    {statusVendas.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.modalItem}
                        onPress={() => {
                          setStatus(item.nome)
                          setModalStatusVisivel(false)
                        }}
                      >
                        <Text>{item.nome}</Text>
                      </TouchableOpacity>
                    ))}
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
                onPress={() => router.replace('/pedidos')}
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
  container: { padding: 20, paddingBottom: 40 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 5,
    borderRadius: 6
  },
  erro: { color: 'red', fontSize: 12, marginBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  picker: { justifyContent: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
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

export default FormularioPedidos