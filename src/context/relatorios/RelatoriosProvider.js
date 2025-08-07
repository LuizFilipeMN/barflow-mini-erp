import React from 'react';
import { RelatorioClientesProvider } from './RelatorioClientesContext';
import { RelatorioProdutosProvider } from './RelatorioProdutosContext';
import { RelatorioVendasProvider } from './RelatorioVendasContext';

export function RelatoriosProvider({ children }) {
    return (
        <RelatorioClientesProvider>
            <RelatorioProdutosProvider>
                <RelatorioVendasProvider>
                    {children}
                </RelatorioVendasProvider>
            </RelatorioProdutosProvider>
        </RelatorioClientesProvider>
    );
}