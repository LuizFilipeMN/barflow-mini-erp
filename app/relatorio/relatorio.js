import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RelatoriosHome() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      {[
        { label: 'Relatório de vendas', path: '/relatorios/vendas' },
        { label: 'Relatório de produtos', path: '/relatorios/produtos' },
        { label: 'Relatório de clientes', path: '/relatorios/clientes' },
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => router.push(item.path)}>
          <View style={styles.placeholderImage} />
          <Text style={styles.cardText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { marginBottom: 20, alignItems: 'center' },
  placeholderImage: { width: 300, height: 120, backgroundColor: '#ccc', marginBottom: 10 },
  cardText: { fontSize: 16 },
});
