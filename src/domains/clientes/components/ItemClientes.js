import { Entypo, Feather } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ItemClientes = ({ cliente, onEditar, onExcluir }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.cellNome}>{cliente.nome}</Text>
      <Text style={styles.cellDocumento}>{cliente.documento}</Text>
      <View style={styles.cellAcoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => onEditar(cliente)}>
          <Feather name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => onExcluir(cliente.id)}>
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
    flex: 3,
    fontSize: 14,
    color: '#333',
    paddingRight: 5
  },
  cellDocumento: {
    flex: 3,
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
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

export default ItemClientes
