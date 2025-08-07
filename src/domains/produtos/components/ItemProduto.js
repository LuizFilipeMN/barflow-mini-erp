import { Entypo, Feather } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ItemProduto = ({ produto = {}, onEditar, onExcluir }) => {
  const { nome = '-', quantidade = 0, valorVenda = 0, id } = produto

  const formatarNumero = (valor) => {
    const numero = Number(valor)
    return isNaN(numero) ? '0' : numero.toLocaleString('pt-BR')
  }

  const formatarMoeda = (valor) => {
    const numero = Number(valor)
    return isNaN(numero)
      ? 'R$ 0,00'
      : numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <View style={styles.row}>
      <Text style={styles.cellNome} numberOfLines={1} ellipsizeMode="tail">
        {nome}
      </Text>

      <Text style={styles.cellQuantidade}>
        {formatarNumero(quantidade)}
      </Text>

      <Text style={styles.cellValor}>
        {formatarMoeda(valorVenda)}
      </Text>

      <View style={styles.cellAcoes}>
        <TouchableOpacity
          style={styles.editar}
          onPress={() => onEditar?.(produto)}
          activeOpacity={0.8}
        >
          <Feather name="edit" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.excluir}
          onPress={() => onExcluir?.(id)}
          activeOpacity={0.8}
        >
          <Entypo name="cross" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  cellNome: {
    flex: 4,
    fontSize: 16,
    paddingHorizontal: 5
  },
  cellQuantidade: {
    flex: 2,
    fontSize: 16,
    textAlign: 'right',
    paddingRight: 5
  },
  cellValor: {
    flex: 3,
    fontSize: 16,
    textAlign: 'right',
    paddingRight: 5,
    color: '#555'
  },
  cellAcoes: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  editar: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 4
  },
  excluir: {
    backgroundColor: '#dc3545',
    padding: 6,
    borderRadius: 4
  }
})

export default ItemProduto