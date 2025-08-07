import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProvidersWrapper from './context/ProvidersWrapper';

// Autenticação
import FormularioCadastro from './src/domains/cadastro/components/FormularioCadastro';
import FormularioLogin from './src/domains/cadastro/components/FormularioLogin';
import RecuperarSenha from './src/domains/cadastro/components/RecuperarSenha';

// Pedidos
import FormularioPedidos from './src/domains/pedidos/components/FormularioPedidos';
import ListaPedidos from './src/domains/pedidos/components/ListaPedidos';

// Clientes
import FormularioClientes from './src/domains/clientes/components/FormularioClientes';
import ListaClientes from './src/domains/clientes/components/ListaClientes';

// Produtos
import FormularioProduto from './src/domains/produtos/components/FormularioProduto';
import ListaProdutos from './src/domains/produtos/components/ListaProdutos';

//Estoque
import FormularioEntrada from './src/domains/estoque/components/FormularioEntrada';
import HistoricoProduto from './src/domains/estoque/components/HistoricoProduto';
import ListaEstoque from './src/domains/estoque/components/ListaEstoque';

// Relatorio clientes
import FiltroClientes from './src/domains/relatorios/components/FiltroClientes';
import RelatorioClientes from './src/domains/relatorios/components/RelatorioClientes';

// Relatorio produtos
import FiltroProdutos from './src/domains/relatorios/components/FiltroProdutos';
import RelatorioProdutos from './src/domains/relatorios/components/RelatorioProdutos';

// Relatorio vendas
import FiltroVendas from './src/domains/relatorios/components/FiltroVendas';
import RelatorioVendas from './src/domains/relatorios/components/RelatorioVendas';

// Formas de Pagamento
import FormularioFormasPagamento from './src/domains/formas_pagamento/components/FormularioFormasPagamento';
import ListaFormasPagamento from './src/domains/formas_pagamento/components/ListaFormasPagamento';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ProvidersWrapper>
        <Stack.Navigator initialRouteName="FormularioLogin">
          {/* Autenticação */}
          <Stack.Screen name="FormularioLogin" component={FormularioLogin} options={{ title: 'Login' }} />
          <Stack.Screen name="FormularioCadastro" component={FormularioCadastro} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} options={{ title: 'Recuperar Senha' }} />

          {/* Pedidos */}
          <Stack.Screen name="ListaPedidos" component={ListaPedidos} options={{ title: 'Pedidos' }} />
          <Stack.Screen name="FormularioPedidos" component={FormularioPedidos} options={{ title: 'Formulário de Pedido' }} />
          
          {/* Estoque */}
          <Stack.Screen name="ListaEstoque" component={ListaEstoque} options={{ title: 'Estoque' }} />
          <Stack.Screen name="HistoricoProduto" component={HistoricoProduto} options={{ title: 'Histórico do Produto' }} />
          <Stack.Screen name="FormularioEntrada" component={FormularioEntrada} options={{ title: 'Entrada Manual' }} />

          {/* Clientes */}
          <Stack.Screen name="ListaClientes" component={ListaClientes} options={{ title: 'Clientes' }} />
          <Stack.Screen name="FormularioClientes" component={FormularioClientes} options={{ title: 'Cadastro de Cliente' }} />

          {/* Produtos */}
          <Stack.Screen name="ListaProdutos" component={ListaProdutos} options={{ title: 'Produtos' }} />
          <Stack.Screen name="FormularioProduto" component={FormularioProduto} options={{ title: 'Cadastro de Produto' }} />

          {/* Relatorio clientes */}
          <Stack.Screen name="FiltroClientes" component={FiltroClientes} options={{ title: 'Filtro - Clientes' }} />
          <Stack.Screen name="RelatorioClientes" component={RelatorioClientes} options={{ title: 'Relatório de Clientes' }} />

          {/* Relatorio produtos */}
          <Stack.Screen name="FiltroProdutos" component={FiltroProdutos} options={{ title: 'Filtro - Produtos' }} />
          <Stack.Screen name="RelatorioProdutos" component={RelatorioProdutos} options={{ title: 'Relatório de Produtos' }} />

          {/* Relatorio vendas */}
          <Stack.Screen name="FiltroVendas" component={FiltroVendas} options={{ title: 'Filtro - Vendas' }} />
          <Stack.Screen name="RelatorioVendas" component={RelatorioVendas} options={{ title: 'Relatório de Vendas' }} />

          {/* Formas de Pagamento */}
          <Stack.Screen name="ListaFormasPagamento" component={ListaFormasPagamento} options={{ title: 'Formas de Pagamento' }} />
          <Stack.Screen name="FormularioFormasPagamento" component={FormularioFormasPagamento} options={{ title: 'Cadastro de Forma de Pagamento' }} />
        </Stack.Navigator>
      </ProvidersWrapper>
    </NavigationContainer>
  );
}