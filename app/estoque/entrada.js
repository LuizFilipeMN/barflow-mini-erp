import FormularioEntrada from '../../src/domains/estoque/components/FormularioEntrada'
import BaseLayout from '../../src/domains/shared/BaseLayout'

const EntradaPage = () => {
  return (
    <BaseLayout titulo="Entrada Manual">
      <FormularioEntrada />
    </BaseLayout>
  )
}

export default EntradaPage