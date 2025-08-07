import { Stack } from 'expo-router';
import RecuperarSenha from '../../src/domains/cadastro/components/RecuperarSenha';

export default function RecuperarSenhaPage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Recuperar Senha' }} />
      <RecuperarSenha />
    </>
  );
}
