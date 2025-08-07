import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ClientesContext } from '../../../context/ClientesContext';
import BaseLayout from '../../shared/BaseLayout';
import ItemClientes from './ItemClientes';

const itemPorPagina = 5;

export default function ListaClientes() {
  const router = useRouter();
  const { clientes, excluirCliente } = useContext(ClientesContext);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  const editarCliente = (cliente) => {
    router.push({ pathname: '/clientes/form', params: { cliente: JSON.stringify(cliente) } });
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.documento.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / itemPorPagina);

  const clientesPaginados = clientesFiltrados.slice(
    (paginaAtual - 1) * itemPorPagina,
    paginaAtual * itemPorPagina
  );

  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <BaseLayout titulo="Clientes">
      <View style={styles.container}>
        <View style={styles.areaAcima}>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={() => router.push('/clientes/form')}>
            <Text style={styles.textoBotaoAdicionar}>+ Novo cliente</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Buscar por nome ou documento"
            style={styles.input}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.cellNome}>Nome</Text>
          <Text style={styles.cellDocumento}>Documento</Text>
          <Text style={styles.cellAcoes}>Ações</Text>
        </View>

        <FlatList
          data={clientesPaginados}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ItemClientes cliente={item} onEditar={editarCliente} onExcluir={() => excluirCliente(item.id)} />
          )}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum cliente encontrado.</Text>}
        />

        {totalPaginas > 1 && (
          <View style={styles.paginacao}>
            <TouchableOpacity onPress={paginaAnterior} disabled={paginaAtual == 1}>
              <Text style={[styles.paginaBotao, paginaAtual == 1 && styles.botaoDesativado]}>←</Text>
            </TouchableOpacity>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
              <TouchableOpacity key={pagina} onPress={() => setPaginaAtual(pagina)}>
                <Text style={[styles.paginaNumero, paginaAtual == pagina && styles.paginaAtiva]}>
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
  );
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
  cellDocumento: {
    flex: 3,
    fontWeight: 'bold',
    textAlign: 'center'
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
});
