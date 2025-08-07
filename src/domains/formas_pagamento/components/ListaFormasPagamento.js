import { useRouter } from 'expo-router'
import { useContext, useState } from 'react'
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { FormasPagamentoContext } from '../../../context/FormasPagamentoContext'
import BaseLayout from '../../shared/BaseLayout'
import ItemFormasPagamento from './ItemFormasPagamento'

const itemPorPagina = 5

export default function ListaFormasPagamento() {
  const router = useRouter()
  const { formasPagamento, excluirForma } = useContext(FormasPagamentoContext)

  const [filtro, setFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)

  const formasFiltradas = formasPagamento.filter(f =>
    f.nome.toLowerCase().includes(filtro.toLowerCase())
  )

  const totalPaginas = Math.ceil(formasFiltradas.length / itemPorPagina)

  const formasPaginadas = formasFiltradas.slice(
    (paginaAtual - 1) * itemPorPagina,
    paginaAtual * itemPorPagina
  )

  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1)
  }

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1)
  }

  const editarForma = (forma) => {
    router.push({
      pathname: '/formas_pagamento/form',
      params: { forma: JSON.stringify(forma) }
    })
  }

  return (
    <BaseLayout titulo="Formas de Pagamento">
      <View style={styles.container}>
        <View style={styles.areaAcima}>
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => router.push('/formas_pagamento/form')}
          >
            <Text style={styles.textoBotaoAdicionar}>+ Nova forma de pagamento</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Buscar por nome"
            style={styles.input}
            value={filtro}
            onChangeText={setFiltro}
          />
        </View>

        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <Text style={styles.cellNome}>Nome</Text>
          <Text style={styles.cellTipo}>Tipo</Text>
          <Text style={styles.cellAcoes}>Ações</Text>
        </View>

        <FlatList
          data={formasPaginadas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ItemFormasPagamento
              item={item}
              onEditar={editarForma}
              onExcluir={excluirForma}
            />
          )}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhuma forma de pagamento encontrada.</Text>}
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
                <Text style={[styles.paginaNumero, paginaAtual == pagina && styles.paginaAtiva]}>
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
  cellNome: {
    flex: 4,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 5
  },
  cellTipo: {
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