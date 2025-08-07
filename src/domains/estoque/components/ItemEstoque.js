import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { EstoqueContext } from '../../../context/EstoqueContext'

const ItemEstoque = ({ produto }) => {
  const { calcularEstoque } = useContext(EstoqueContext)
  const { entradas, saidas } = calcularEstoque(produto?.id)
  const saldo = Number(produto?.quantidade || 0)

  const abrirHistorico = () => {
    router.push({
      pathname: '/estoque/historico',
      params: { produtoId: produto?.id }
    })
  }

  return (
    <View style={styles.row}>
      <View style={styles.infoPrincipal}>
        <Text style={styles.cellNome}>{produto?.nome || 'Sem nome'}</Text>
        <TouchableOpacity
          onPress={abrirHistorico}
          style={styles.botaoHistorico}
          accessibilityLabel={`Ver histórico de ${produto?.nome}`}
        >
          <Feather name="clock" size={18} color="#555" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.cellQtd, saldo < 0 && styles.qtdNegativa]}>
        {saldo.toFixed(0)}
      </Text>
      <Text style={styles.cellEntrada}>{Number(entradas || 0).toFixed(0)}</Text>
      <Text style={styles.cellSaida}>{Number(saidas || 0).toFixed(0)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
    gap: 4
  },
  infoPrincipal: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  botaoHistorico: {
    padding: 6
  },
  cellNome: {
    fontSize: 14,
    color: '#333'
  },
  cellQtd: {
    flex: 2,
    fontSize: 14,
    textAlign: 'right',
    color: '#28a745'
  },
  qtdNegativa: {
    color: '#ff0000'
  },
  cellEntrada: {
    flex: 2,
    fontSize: 14,
    textAlign: 'right',
    color: '#007bff'
  },
  cellSaida: {
    flex: 2,
    fontSize: 14,
    textAlign: 'right',
    color: '#dc3545',
    paddingRight: 5
  }
})

export default ItemEstoque