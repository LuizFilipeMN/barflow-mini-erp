import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import { ClientesContext } from '../../../context/ClientesContext'
import { FormasPagamentoContext } from '../../../context/FormasPagamentoContext'
import { ProdutosContext } from '../../../context/ProdutosContext'
import { useRelatorioVendas } from '../../../context/relatorios/RelatorioVendasContext'
import AutoCompleteInput from '../../shared/AutoCompleteInput'
import BaseLayout from '../../shared/BaseLayout'

export default function FiltroVendas() {
  const [cliente, setCliente] = useState('')
  const [produto, setProduto] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('')
  const [dataInicio, setDataInicio] = useState(null)
  const [dataFim, setDataFim] = useState(null)
  const [mostrarInicio, setMostrarInicio] = useState(false)
  const [mostrarFim, setMostrarFim] = useState(false)
  const [mostrarStatusDropdown, setMostrarStatusDropdown] = useState(false)
  const [statusSelecionados, setStatusSelecionados] = useState([])
  const statusOpcoes = ['Em aberto', 'Em andamento', 'Concluída', 'Cancelada', 'Fiado']
  const alternarStatus = (status) => {
    setStatusSelecionados((prev) =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }
  const { aplicarFiltros } = useRelatorioVendas()
  const { clientes } = useContext(ClientesContext)
  const { produtos } = useContext(ProdutosContext)
  const { formasPagamento } = useContext(FormasPagamentoContext)
  const router = useRouter()

  const formatarData = (data) =>
    data ? format(new Date(data), 'dd/MM/yyyy') : ''

  const handleAplicar = () => {
    aplicarFiltros({
      cliente,
      produto,
      formaPagamento,
      dataInicio: dataInicio ? dataInicio.toISOString() : '',
      dataFim: dataFim ? dataFim.toISOString() : '',
      status: statusSelecionados
    })
    router.push('/relatorios/vendas/relatorio')
  }

  return (
    <BaseLayout titulo="Relatório de Vendas">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.field}>
            <Text style={styles.label}>Cliente</Text>
            <AutoCompleteInput
              placeholder="Nome do cliente"
              dados={clientes}
              campoChave="id"
              campoLabel="nome"
              valorInicial={cliente}
              onSelecionar={(item) => setCliente(item.nome)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Produto</Text>
            <AutoCompleteInput
              placeholder="Nome do produto"
              dados={produtos}
              campoChave="id"
              campoLabel="nome"
              valorInicial={produto}
              onSelecionar={(item) => setProduto(item.nome)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Forma de pagamento</Text>
            <AutoCompleteInput
              placeholder="Pix, Cartão, Dinheiro..."
              dados={formasPagamento}
              campoChave="id"
              campoLabel="nome"
              valorInicial={formaPagamento}
              onSelecionar={(item) => setFormaPagamento(item.nome)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Data da venda</Text>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setMostrarInicio(true)}
                style={[styles.input, styles.dataInput]}
              >
                <Text>{formatarData(dataInicio) || 'De (dd/mm/aaaa)'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMostrarFim(true)}
                style={[styles.input, styles.dataInput]}
              >
                <Text>{formatarData(dataFim) || 'Até (dd/mm/aaaa)'}</Text>
              </TouchableOpacity>
            </View>

            {mostrarInicio && (
              <DateTimePicker
                value={dataInicio || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, date) => {
                  setMostrarInicio(false)
                  if (date) setDataInicio(date)
                }}
              />
            )}

            {mostrarFim && (
              <DateTimePicker
                value={dataFim || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, date) => {
                  setMostrarFim(false)
                  if (date) setDataFim(date)
                }}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Status da venda</Text>
            <TouchableOpacity
              style={styles.multiSelectInput}
              onPress={() => setMostrarStatusDropdown(prev => !prev)}
            >
              <Text style={{ color: statusSelecionados.length === 0 ? '#aaa' : '#000' }}>
                {statusSelecionados.length > 0
                  ? statusSelecionados.join(', ')
                  : 'Selecione o(s) status'}
              </Text>
            </TouchableOpacity>

            {mostrarStatusDropdown && (
              <View style={styles.dropdown}>
                {statusOpcoes.map((status, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.dropdownItem}
                    onPress={() => alternarStatus(status)}
                  >
                    <Text style={{ color: statusSelecionados.includes(status) ? '#007bff' : '#000' }}>
                      {statusSelecionados.includes(status) ? '✓ ' : ''}{status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAplicar}>
            <Text style={styles.buttonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  },
  field: {
    marginBottom: 16
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  dataInput: {
    flex: 1
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  multiSelectInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingVertical: 8
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12
  }

})