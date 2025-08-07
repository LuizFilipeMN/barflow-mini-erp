import { Entypo, Feather } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ItemFormasPagamento({ item, onEditar, onExcluir }) {
  return (
    <View style={styles.row}>
      <Text style={styles.cellNome}>{item.nome}</Text>
      <Text style={styles.cellTipo}>{item.tipo}</Text>
      <View style={styles.cellAcoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => onEditar(item)}>
          <Feather name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => onExcluir(item.id)}>
          <Entypo name="cross" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1
  },
  cellNome: {
    flex: 4,
    fontSize: 14,
    color: '#333'
  },
  cellTipo: {
    flex: 3,
    fontSize: 14,
    textAlign: 'right',
    color: '#666'
  },
  cellAcoes: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  },
  botaoEditar: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 4
  },
  botaoExcluir: {
    backgroundColor: '#dc3545',
    padding: 6,
    borderRadius: 4
  }
})