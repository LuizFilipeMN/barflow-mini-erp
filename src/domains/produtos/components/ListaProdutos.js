import { useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ProdutosContext } from '../../../context/ProdutosContext'
import BaseLayout from '../../shared/BaseLayout'
import ItemProduto from './ItemProduto'

const itemPorPagina = 5

const ListaProdutos = () => {
  const { produtos, excluirProduto } = useContext(ProdutosContext)
  const [filtro, setFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const router = useRouter()

  const editarProduto = (produto) => {
    try {
      if (!produto || typeof produto !== 'object') return

      const json = JSON.stringify({
        id: produto.id || '',
        codigo: produto.codigo || '',
        nome: produto.nome || '',
        quantidade: produto.quantidade ?? 0,
        valorCusto: produto.valorCusto ?? 0,
        valorVenda: produto.valorVenda ?? 0
      })

      router.push({ pathname: '/produtos/form', params: { produto: json } })
    } catch (e) {
      console.error('Erro ao preparar produto para edição:', e)
    }
  }

  const produtosFiltrados = produtos.filter(p =>
    (p.nome?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
    ((typeof p.codigo == 'string' || typeof p.codigo == 'number') ? p.codigo.toString() : '').includes(filtro)
  )


  const totalPaginas = Math.ceil(produtosFiltrados.length / itemPorPagina)

  const produtosPaginados = produtosFiltrados.slice(
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
    <BaseLayout titulo="Produtos">
      <View style={styles.container}>
        <View style={styles.areaAcima}>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={() => router.push('/produtos/form')}>
            <Text style={styles.textoBotaoAdicionar}>+ Novo produto</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Buscar por nome ou código"
            style={styles.input}
            value={filtro}
            onChangeText={setFiltro}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.cellNome}>Nome</Text>
          <Text style={styles.cellQuantidade}>Qtd</Text>
          <Text style={styles.cellValor}>Valor</Text>
          <Text style={styles.cellAcoes}>Ações</Text>
        </View>

        <FlatList
          data={produtosPaginados}
          keyExtractor={item => (item?.id ? item.id.toString() : Math.random().toString())}
          renderItem={({ item }) => (
            <ItemProduto
              produto={item}
              onEditar={editarProduto}
              onExcluir={excluirProduto}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          }
        />

        {totalPaginas > 1 && (
          <View style={styles.paginacao}>
            <TouchableOpacity onPress={paginaAnterior} disabled={paginaAtual == 1}>
              <Text style={[styles.paginaBotao, paginaAtual == 1 && styles.botaoDesativado]}>←</Text>
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
              <Text style={[styles.paginaBotao, paginaAtual == totalPaginas && styles.botaoDesativado]}>→</Text>
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
  cellNome: {
    flex: 4,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 5
  },
  cellQuantidade: {
    flex: 2,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 5
  },
  cellValor: {
    flex: 3,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 5
  },
  cellAcoes: {
    flex: 3,
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

export default ListaProdutos