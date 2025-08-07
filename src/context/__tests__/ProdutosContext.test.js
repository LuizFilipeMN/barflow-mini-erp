import { act, render } from '@testing-library/react-native';
import React from 'react';
import { ProdutosContext, ProdutosProvider } from '../ProdutosContext';

jest.mock('../../services/firebase', () => ({
    db: {}
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
    addDoc: jest.fn(() => Promise.resolve({ id: '123' })),
    updateDoc: jest.fn(() => Promise.resolve()),
    deleteDoc: jest.fn(() => Promise.resolve()),
    doc: jest.fn()
}));

describe('ProdutosContext', () => {
    let contextValue;

    function TestComponent() {
        contextValue = React.useContext(ProdutosContext);
        return null;
    }

    beforeEach(() => {
        contextValue = undefined;
        render(
            <ProdutosProvider>
                <TestComponent />
            </ProdutosProvider>
        );
    });

    it('adiciona produto', async () => {
        await act(async () => {
            await contextValue.adicionarProduto({ nome: 'Cerveja', quantidade: 10 });
        });

        expect(contextValue.produtos.length).toBe(1);
        expect(contextValue.produtos[0].nome).toBe('Cerveja');
        expect(contextValue.produtos[0].quantidade).toBe(10);
    });

    it('edita produto', async () => {
        await act(async () => {
            await contextValue.adicionarProduto({ nome: 'Cerveja', quantidade: 10 });
        });

        await act(async () => {
            await contextValue.editarProduto({ id: '123', nome: 'Cerveja Amanda', quantidade: 20 });
        });

        expect(contextValue.produtos.length).toBe(1);
        expect(contextValue.produtos[0].nome).toBe('Cerveja Amanda');
        expect(contextValue.produtos[0].quantidade).toBe(20);
    });

    it('exclui produto', async () => {
        await act(async () => {
            await contextValue.adicionarProduto({ nome: 'Cerveja', quantidade: 10 });
        });

        await act(async () => {
            await contextValue.excluirProduto('123');
        });

        expect(contextValue.produtos.length).toBe(0);
    });

    it('registra automaticamente entrada e saída de produtos', async () => {
        await act(async () => {
            await contextValue.adicionarProduto({ nome: 'Água', quantidade: 10 });
        });

        await act(async () => {
            await contextValue.adicionarEntradaAoProduto('123', 5);
        });

        expect(contextValue.produtos[0].quantidade).toBe(15);

        if (contextValue.adicionarSaidaAoProduto) {
            await act(async () => {
                await contextValue.adicionarSaidaAoProduto('123', 3);
            });

            expect(contextValue.produtos[0].quantidade).toBe(12);
        }
    });
});