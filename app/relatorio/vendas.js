import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

export default function RelatorioVendas() {
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [dataDe, setDataDe] = useState('');
  const [dataAte, setDataAte] = useState('');

  const gerarRelatorio = () => {
    const filtros = {
      cliente,
      produto,
      formaPagamento,
      dataDe,
      dataAte,
    };
    console.log('Filtros do relatório de vendas:', filtros);
    Alert.alert('Filtros aplicados', JSON.stringify(filtros, null, 2));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório de vendas</Text>

      <View style={styles.field}>
        <Text>Cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Cliente"
          value={cliente}
          onChangeText={setCliente}
        />
      </View>

      <View style={styles.field}>
        <Text>Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Produto"
          value={produto}
          onChangeText={setProduto}
        />
      </View>

      <View style={styles.field}>
        <Text>Forma de pagamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Forma de pagamento"
          value={formaPagamento}
          onChangeText={setFormaPagamento}
        />
      </View>

      <View style={styles.field}>
        <Text>Data da venda</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 5 }]}
            placeholder="De"
            value={dataDe}
            onChangeText={setDataDe}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 5 }]}
            placeholder="Até"
            value={dataAte}
            onChangeText={setDataAte}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={gerarRelatorio}>
        <Text style={styles.buttonText}>Gerar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  field: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  row: { flexDirection: 'row' },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
