import { Stack } from 'expo-router';
import FormularioCadastro from '../../src/domains/cadastro/components/FormularioCadastro';

export default function FormCadastroPage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Cadastro' }} />
      <FormularioCadastro />
    </>
  );
}
