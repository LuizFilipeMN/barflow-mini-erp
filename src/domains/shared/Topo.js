import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { AuthContext } from '../../context/AuthContext'

const { width } = Dimensions.get('window')

const Topo = () => {
  const { usuario, isAutenticado, logout } = useContext(AuthContext)
  const [menuVisivel, setMenuVisivel] = useState(false)
  const router = useRouter()

  const abrirMenu = () => setMenuVisivel(true)
  const fecharMenu = () => setMenuVisivel(false)

  const sair = () => {
    fecharMenu()
    logout()
    router.replace('/login')
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/barflow-logo.png')}
        style={styles.logo}
        resizeMode="cover"
      />

      {isAutenticado && (
        <>
          <TouchableOpacity onPress={abrirMenu} style={styles.userButton}>
            <Feather name="user" size={28} color="#fff" />
          </TouchableOpacity>

          <Modal visible={menuVisivel} transparent animationType="fade">
            <TouchableOpacity style={styles.modalFundo} onPress={fecharMenu}>
              <View style={styles.modalMenu}>
                <Text style={styles.usuarioTexto}>
                  {usuario.displayName || usuario.email}
                </Text>
                <TouchableOpacity onPress={sair} style={styles.botaoSair}>
                  <Text style={styles.textoSair}>Sair</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    position: 'relative',
    backgroundColor: '#d1cdbc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '100%',
    height: 80
  },
  userButton: {
    position: 'absolute',
    bottom: 28,
    right: 16,
    backgroundColor: '#0008',
    borderRadius: 25,
    padding: 5
  },
  modalFundo: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingTop: 100,
    paddingRight: 16
  },
  modalMenu: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  usuarioTexto: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600'
  },
  botaoSair: {
    backgroundColor: '#d00',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  textoSair: {
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default Topo