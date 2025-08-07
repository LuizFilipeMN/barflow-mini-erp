import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import Papa from 'papaparse'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useRelatorioVendas } from '../../../context/relatorios/RelatorioVendasContext'
import BaseLayout from '../../shared/BaseLayout'

export default function RelatorioVendas() {
  const { resultado } = useRelatorioVendas()

  const formatar = (valor) =>
    `R$ ${valor.toFixed(2).replace('.', ',')}`

  const totais = resultado.reduce((acc, item) => {
    const valor = item.valorTotalBruto || 0
    acc.geral += valor

    const forma = item.formaPagamentoKey || '-'
    if (forma) {
      if (!acc[forma]) acc[forma] = 0
      acc[forma] += valor
    }

    return acc
  }, { geral: 0 })

  const colunas = [
    'Código',
    'Cliente',
    'Produto',
    'Qtd.',
    'Vr.Produto',
    'Vr.Total',
    'Forma de pagamento',
    'Data'
  ]

  const exportarCSV = async () => {
    if (!resultado || resultado.length === 0) return

    const csv = Papa.unparse(
      resultado.map(venda => ({
        Código: venda.codigo,
        Cliente: venda.cliente,
        Produto: venda.produto,
        Quantidade: venda.quantidade,
        'Valor Produto': venda.valorProduto,
        'Valor Total': venda.valorTotal,
        'Forma de Pagamento': venda.formaPagamento,
        Data: venda.data
      }))
    )

    const fileUri = FileSystem.documentDirectory + 'relatorio_vendas.csv'
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8
    })
    await Sharing.shareAsync(fileUri)
  }

  return (
    <BaseLayout titulo="Relatório de Vendas">
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {colunas.map((col, i) => (
              <Text key={i} style={styles.headerCell}>{col}</Text>
            ))}
          </View>

          {resultado.map((venda, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{venda.codigo}</Text>
              <Text style={styles.cell}>{venda.cliente}</Text>
              <Text style={styles.cell}>{venda.produto}</Text>
              <Text style={styles.cell}>{venda.quantidade}</Text>
              <Text style={styles.cell}>{venda.valorProduto}</Text>
              <Text style={styles.cell}>{venda.valorTotal}</Text>
              <Text style={styles.cell}>{venda.formaPagamento}</Text>
              <Text style={styles.cell}>{venda.data}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.totalizadores}>
        <Text style={styles.totalTitulo}>Totalizadores</Text>

        <View style={styles.totalLinha}>
          <Text style={styles.totalLabel}>Total geral:</Text>
          <Text style={styles.totalValor}>{formatar(totais.geral)}</Text>
        </View>

        {Object.entries(totais)
          .filter(([key]) => key !== 'geral')
          .map(([forma, valor], index) => (
            <View key={index} style={styles.totalLinha}>
              <Text style={styles.totalLabel}>
                Total {forma.charAt(0).toUpperCase() + forma.slice(1)}:
              </Text>
              <Text style={styles.totalValor}>{formatar(valor)}</Text>
            </View>
          ))}
      </View>

      <TouchableOpacity style={styles.botaoExportar} onPress={exportarCSV}>
        <Text style={styles.textoBotao}>Exportar CSV</Text>
      </TouchableOpacity>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  table: {
    minWidth: 1000,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    color: '#fff'
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#333'
  },
  totalizadores: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    elevation: 1
  },
  totalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  totalLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  totalLabel: {
    fontSize: 14,
    color: '#444'
  },
  totalValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  botaoExportar: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  }
})
