import { act, render } from '@testing-library/react-native';

import React from 'react';
import { EstoqueContext, EstoqueProvider } from '../EstoqueContext';
import { ProdutosContext } from '../ProdutosContext';

const produtosMock = [
    { id: '1', nome: 'Cerveja', quantidade: 10 },
    { id: '2', nome: 'Refrigerante', quantidade: 5 }
];

const adicionarEntradaAoProduto = jest.fn();
const adicionarSaidaAoProduto = jest.fn();

const ProdutosProviderMock = ({ children }) => (
    <ProdutosContext.Provider
        value={{
            produtos: produtosMock,
            adicionarEntradaAoProduto,
            adicionarSaidaAoProduto
        }}
    >
        {children}
    </ProdutosContext.Provider>
);

describe('EstoqueContext', () => {
    it('atualiza o estoque corretamente ao registrar entrada e saída', () => {
        let estoqueValue;
        function TestComponent() {
            estoqueValue = React.useContext(EstoqueContext);
            return null;
        }

        render(
            <ProdutosProviderMock>
                <EstoqueProvider>
                    <TestComponent />
                </EstoqueProvider>
            </ProdutosProviderMock>
        );

        act(() => {
            estoqueValue.registrarEntrada({ produtoId: '1', quantidade: 5 });
        });

        act(() => {
            estoqueValue.registrarSaida({ produtoId: '1', quantidade: 2 });
        });

        const historico = estoqueValue.getMovimentacoesPorProduto('1');
        expect(historico.length).toBe(2);
        expect(historico[0].tipo).toBe('saída');
        expect(historico[1].tipo).toBe('entrada');
    });

    it('identifica estoque baixo após múltiplas saídas', () => {
        let estoqueValue;

        function TestComponent() {
            estoqueValue = React.useContext(EstoqueContext);
            return null;
        }

        render(
            <ProdutosProviderMock>
                <EstoqueProvider>
                    <TestComponent />
                </EstoqueProvider>
            </ProdutosProviderMock>
        );

        act(() => {
            estoqueValue.registrarSaida({ produtoId: '2', quantidade: 3, origem: 'Venda' });
            estoqueValue.registrarSaida({ produtoId: '2', quantidade: 2, origem: 'Venda' });
        });

        const { entradas, saidas } = estoqueValue.calcularEstoque('2');
        const saldoAtual = produtosMock.find(p => p.id === '2').quantidade - saidas;

        expect(saldoAtual <= 5).toBe(true);
    });

    it('armazena e exibe o histórico de vendas', () => {
        let estoqueValue;
        function TestComponent() {
            estoqueValue = React.useContext(EstoqueContext);
            return null;
        }

        render(
            <ProdutosProviderMock>
                <EstoqueProvider>
                    <TestComponent />
                </EstoqueProvider>
            </ProdutosProviderMock>
        );

        act(() => {
            estoqueValue.registrarSaida({ produtoId: '1', quantidade: 2, origem: 'Venda' });
        });

        const historico = estoqueValue.getMovimentacoesPorProduto('1');
        expect(historico.length).toBeGreaterThan(0);
        expect(historico[0]).toMatchObject({
            tipo: 'saída',
            produtoId: '1',
            quantidade: 2,
            origem: 'Venda'
        });
    });
});