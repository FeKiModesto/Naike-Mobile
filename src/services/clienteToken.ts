import * as SecureStore from "expo-secure-store";

const CADASTRO_TOKEN_KEY = "naike_cadastro_token";

export async function salvarTokenCadastro(token: string): Promise<void> {
  await SecureStore.setItemAsync(CADASTRO_TOKEN_KEY, token);
}
