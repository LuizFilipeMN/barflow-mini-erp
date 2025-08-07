import { Feather } from '@expo/vector-icons'
import { isThisMonth, parseISO } from 'date-fns'
import React, { useContext, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { PedidosContext } from '../../../context/PedidosContext'
import BaseLayout from '../../shared/BaseLayout'

const Dashboard = () => {
  const { pedidos } = useContext(PedidosContext)

  const {
    totalAprovadas,
    totalEmAberto,
    totalCanceladas,
    totalMesAtual
  } = useMemo(() => {
    let aprovadas = 0
    let emAberto = 0
    let canceladas = 0
    let mesAtual = 0

    pedidos.forEach(pedido => {
      if (!pedido || !pedido.status || isNaN(Number(pedido.valor))) return

      const valor = Number(pedido.valor || 0)
      const status = pedido.status
      const data = pedido.dataVenda || pedido.created_at
      const isConcluida = status == 'Concluída'
      const isCancelada = status == 'Cancelada'
      const isEmAberto = ['Em aberto', 'Em andamento', 'Fiado'].includes(status)

      if(isConcluida){
        aprovadas += valor
        if(data && isThisMonth(parseISO(data))){
          mesAtual += valor
        }
      }else if(isCancelada){
        canceladas += valor
      }else if (isEmAberto){
        emAberto += valor
      }
    })

    return {
      totalAprovadas: aprovadas,
      totalEmAberto: emAberto,
      totalCanceladas: canceladas,
      totalMesAtual: mesAtual
    }
  }, [pedidos])

  const formatar = valor =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

  return (
    <BaseLayout titulo="Início">
      <View style={styles.cardAprovadas}>
        <View style={styles.cardHeader}>
          <Feather name="check-circle" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.cardTitle}>Vendas aprovadas</Text>
        </View>
        <Text style={styles.cardValue}>{formatar(totalAprovadas)}</Text>
      </View>

      <View style={styles.cardEmAberto}>
        <View style={styles.cardHeader}>
          <Feather name="alert-circle" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.cardTitle}>Vendas em aberto</Text>
        </View>
        <Text style={styles.cardValue}>{formatar(totalEmAberto)}</Text>
      </View>

      <View style={styles.cardCanceladas}>
        <View style={styles.cardHeader}>
          <Feather name="x-circle" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.cardTitle}>Vendas canceladas</Text>
        </View>
        <Text style={styles.cardValue}>{formatar(totalCanceladas)}</Text>
      </View>

      <View style={styles.cardMes}>
        <View style={styles.cardHeader}>
          <Feather name="calendar" size={24} color="#fff" style={styles.icone} />
          <Text style={styles.cardTitle}>Vendas do mês</Text>
        </View>
        <Text style={styles.cardValue}>{formatar(totalMesAtual)}</Text>
      </View>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  cardAprovadas: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4
  },
  cardEmAberto: {
    backgroundColor: '#6c757d',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4
  },
  cardCanceladas: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4
  },
  cardMes: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#f8f9fa'
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8f9fa'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  icone: {
    marginRight: 8
  }
})

export default Dashboard