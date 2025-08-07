import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RelatorioClientes() {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const aplicarFiltro = () => {
    const filtros = {
      nome,
      documento,
      telefone,
      endereco,
    };

    console.log('Filtros aplicados:', filtros);
    Alert.alert('Filtro aplicado', JSON.stringify(filtros, null, 2));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatório de clientes</Text>

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
        <Text>Documento</Text>
        <TextInput
          style={styles.input}
          placeholder="Documento"
          value={documento}
          onChangeText={setDocumento}
        />
      </View>

      <View style={styles.field}>
        <Text>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
      </View>

      <View style={styles.field}>
        <Text>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={aplicarFiltro}>
        <Text style={styles.buttonText}>Aplicar Filtros</Text>
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
