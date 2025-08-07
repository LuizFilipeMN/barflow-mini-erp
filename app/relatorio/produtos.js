import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

export default function RelatorioProdutos() {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [valorVenda, setValorVenda] = useState('');

  const gerarRelatorio = () => {
    const filtros = {
      codigo,
      nome,
      quantidade,
      valorCusto,
      valorVenda,
    };
    console.log('Filtros do relatório:', filtros);
    // Aqui você pode disparar uma ação para gerar o relatório usando esses filtros
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório de produtos</Text>

      <View style={styles.field}>
        <Text>Código interno</Text>
        <TextInput
          style={styles.input}
          placeholder="Código interno"
          value={codigo}
          onChangeText={setCodigo}
        />
      </View>

      <View style={styles.field}>
        <Text>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.field}>
        <Text>Quantidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
      </View>

      <View style={styles.field}>
        <Text>Valor de custo</Text>
        <TextInput
          style={styles.input}
          placeholder="Valor de custo"
          keyboardType="numeric"
          value={valorCusto}
          onChangeText={setValorCusto}
        />
      </View>

      <View style={styles.field}>
        <Text>Valor de venda</Text>
        <TextInput
          style={styles.input}
          placeholder="Valor de venda"
          keyboardType="numeric"
          value={valorVenda}
          onChangeText={setValorVenda}
        />
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
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
