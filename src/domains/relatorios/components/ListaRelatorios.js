import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import BaseLayout from '../../shared/BaseLayout'

export default function ListaRelatorios() {
  const router = useRouter()

  const relatorios = [
    { label: 'Relatório de Vendas', path: '/relatorios/vendas/filtro', icon: 'bar-chart' },
    { label: 'Relatório de Produtos', path: '/relatorios/produtos/filtro', icon: 'box' },
    { label: 'Relatório de Clientes', path: '/relatorios/clientes/filtro', icon: 'users' }
  ]

  return (
    <BaseLayout titulo="Relatórios">
      <ScrollView contentContainerStyle={styles.container}>
        {relatorios.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(item.path)}
          >
            <Feather name={item.icon} size={24} color="#fff" style={styles.icon} />
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BaseLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  icon: {
    marginRight: 12
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  }
})