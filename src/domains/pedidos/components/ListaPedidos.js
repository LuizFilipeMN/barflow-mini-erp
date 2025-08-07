import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PedidosContext } from '../../../context/PedidosContext'
import BaseLayout from '../../shared/BaseLayout'
import ItemPedidos from './ItemPedidos'

const itemPorPagina = 5

const ListaPedidos = () => {
  const { pedidos, excluirPedido } = useContext(PedidosContext)
  const [filtro, setFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const router = useRouter()

  const editarPedido = (pedido) => {
    router.push({ pathname: '/pedidos/form', params: { pedido: JSON.stringify(pedido) } })
  }

  const pedidosFiltrados = pedidos
    .filter(p => p?.id)
    .filter(p => p.cliente?.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda))

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itemPorPagina)

  const pedidosPaginados = pedidosFiltrados.slice(
    (paginaAtual - 1) * itemPorPagina,
    paginaAtual * itemPorPagina
  )

  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1)
  }

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1)
  }

  return (
    <BaseLayout titulo="Vendas">
      <View style={styles.container}>
        <View style={styles.areaAcima}>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={() => router.push('/pedidos/form')}>
            <Text style={styles.textoBotaoAdicionar}>+ Nova venda</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Buscar por cliente"
            style={styles.input}
            value={filtro}
            onChangeText={setFiltro}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.cellCliente}>Cliente</Text>
          <Text style={styles.cellStatus}>Status</Text>
          <Text style={styles.cellValor}>Valor</Text>
          <Text style={styles.cellAcoes}>Ações</Text>
        </View>

        <FlatList
          data={pedidosPaginados}
          keyExtractor={item => (item?.id ? item.id.toString() : Math.random().toString())}
          renderItem={({ item }) => (
            <ItemPedidos pedido={item} onEditar={editarPedido} onExcluir={excluirPedido} />
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhuma venda encontrada.</Text>
          }
        />

        {totalPaginas > 1 && (
          <View style={styles.paginacao}>
            <TouchableOpacity onPress={paginaAnterior} disabled={paginaAtual == 1}>
              <Text style={[styles.paginaBotao, paginaAtual == 1 && styles.botaoDesativado]}>
                ←
              </Text>
            </TouchableOpacity>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
              <TouchableOpacity key={pagina} onPress={() => setPaginaAtual(pagina)}>
                <Text style={[
                  styles.paginaNumero,
                  paginaAtual == pagina && styles.paginaAtiva
                ]}>
                  {pagina}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={proximaPagina} disabled={paginaAtual == totalPaginas}>
              <Text style={[styles.paginaBotao, paginaAtual == totalPaginas && styles.botaoDesativado]}>
                → 
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10
  },
  areaAcima: {
    gap: 10
  },
  botaoAdicionar: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 6,
    marginTop: 10,
    alignItems: 'center'
  },
  cellCliente: {
    flex: 3.5,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 5
  },
  cellValor: {
    flex: 3,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 5
  },
  cellStatus: {
    flex: 4,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cellAcoes: {
    flex: 4,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  vazio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20
  },
  paginacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 10
  },
  paginaBotao: {
    fontSize: 16,
    color: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  botaoDesativado: {
    color: '#ccc'
  },
  paginaNumero: {
    fontSize: 16,
    color: '#007bff',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  paginaAtiva: {
    backgroundColor: '#007bff',
    color: '#fff'
  }
})

export default ListaPedidos