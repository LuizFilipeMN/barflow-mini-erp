import { PedidosProvider } from '../../src/context/PedidosContext'
import Lista from '../../src/domains/pedidos/components/ListaPedidos'

export default function PedidosTab() {
  return (
    <PedidosProvider>
      <Lista />
    </PedidosProvider>
  )
}
