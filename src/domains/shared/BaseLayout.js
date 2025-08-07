import { useRouter } from 'expo-router'
import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../../context/AuthContext'
import Rodape from './Rodape'
import Topo from './Topo'

const BaseLayout = ({ children, titulo = '', scrollable = false }) => {
    const [menuAberto, setMenuAberto] = useState(false)
    const router = useRouter()
    const { isAutenticado } = useContext(AuthContext)

    const navegarPara = (item) => {
        setMenuAberto(false)
        switch (item) {
            case 'Início': router.push('/home'); break
            case 'Clientes': router.push('/clientes'); break
            case 'Produtos': router.push('/produtos'); break
            case 'Estoque': router.push('/estoque'); break
            case 'Vendas': router.push('/pedidos'); break
            case 'Formas de pagamento': router.push('/formas_pagamento'); break
            case 'Relatórios': router.push('/relatorios'); break
        }
    }

    const menuItens = [
        'Início', 'Clientes', 'Produtos', 'Estoque',
        'Vendas', 'Formas de pagamento', 'Relatórios'
    ]

    const Conteudo = (
        <>
            {isAutenticado && (
                <>
                    <TouchableOpacity onPress={() => setMenuAberto(!menuAberto)} style={styles.menuButton}>
                        <Text style={styles.menuIcon}>☰</Text>
                        <Text style={styles.titulo}>{titulo}</Text>
                    </TouchableOpacity>

                    {menuAberto && (
                        <View style={styles.menu}>
                            <Text style={styles.menuTitle}>Menu</Text>
                            {menuItens.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => navegarPara(item)}>
                                    <Text style={styles.menuItem}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </>
            )}
            {children}
        </>
    )

    return (
        <>
            <Topo />
            {scrollable
                ? <ScrollView contentContainerStyle={styles.scrollContainer}>{Conteudo}</ScrollView>
                : <View style={styles.scrollContainer}>{Conteudo}</View>}
            <Rodape />
        </>
    )
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, padding: 20 },
    menuButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    menuIcon: { fontSize: 26, fontWeight: 'bold', marginRight: 10 },
    menu: { backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 4, marginBottom: 20 },
    menuTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 6 },
    menuItem: { fontSize: 14, marginVertical: 4 },
    titulo: { fontSize: 20, fontWeight: 'bold' }
})

export default BaseLayout