import { useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { ProdutosContext } from '../../../context/ProdutosContext'
import BaseLayout from '../../shared/BaseLayout'
import ItemEstoque from './ItemEstoque'

const itemPorPagina = 5

const ListaEstoque = () => {
  const router = useRouter()
  const { produtos } = useContext(ProdutosContext)
  const [filtro, setFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    setPaginaAtual(1)
  }, [filtro])

  const produtosFiltrados = produtos.filter(p =>
    p.nome?.toLowerCase().includes(filtro.trim().toLowerCase())
  )

  const totalPaginas = Math.ceil(produtosFiltrados.length / itemPorPagina)

  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * itemPorPagina,
    paginaAtual * itemPorPagina
  )

  return (
    <BaseLayout titulo="Estoque">
      <View style={styles.container}>
        <View style={styles.areaAcima}>
          <TextInput
            placeholder="Buscar por nome"
            style={styles.input}
            value={filtro}
            onChangeText={setFiltro}
          />
          <TouchableOpacity
            style={styles.botaoEntrada}
            onPress={() => router.push('/estoque/entrada')}
          >
            <Text style={styles.botaoTexto}>+ Entrada manual</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.cellNome}>Produto</Text>
          <Text style={styles.cellQtd}>Qtd</Text>
          <Text style={styles.cellEntrada}>Entradas</Text>
          <Text style={styles.cellSaida}>Saídas</Text>
        </View>

        <FlatList
          data={produtosPaginados}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ItemEstoque produto={item} />}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          }
        />

        {totalPaginas > 1 && (
          <View style={styles.paginacao}>
            <TouchableOpacity
              onPress={() => setPaginaAtual(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              <Text style={[
                styles.paginaBotao,
                paginaAtual === 1 && styles.botaoDesativado
              ]}>
                ←
              </Text>
            </TouchableOpacity>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
              <TouchableOpacity key={pagina} onPress={() => setPaginaAtual(pagina)}>
                <Text style={[
                  styles.paginaNumero,
                  paginaAtual === pagina && styles.paginaAtiva
                ]}>
                  {pagina}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setPaginaAtual(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              <Text style={[
                styles.paginaBotao,
                paginaAtual === totalPaginas && styles.botaoDesativado
              ]}>
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
  cellNome: {
    flex: 4,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 5
  },
  cellQtd: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  cellEntrada: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  cellSaida: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 5
  },
  botaoEntrada: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold'
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

export default ListaEstoque