import { useAction } from './useAction';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
export function useCadastroCliente() {
  const { acceptSession } = useAuth();
  return useAction({ mutationFn: authService.register, onSuccess: acceptSession });
}
export function useLogin() {
  const { acceptSession } = useAuth();
  return useAction({ mutationFn: authService.login, onSuccess: acceptSession });
}
