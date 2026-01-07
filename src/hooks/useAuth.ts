import { UseMutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerUser, verifyOtp, loginUser, getMe, VerifyResponse, RegisterResponse, RegisterPayload, LoginPayload } from "../services/authService";
import { clearToken, setToken } from "../utilis/auth";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh_token";

export function useRegister(options?: UseMutationOptions<RegisterResponse, Error, RegisterPayload, unknown>
  ) {
    return useMutation<RegisterResponse, Error, RegisterPayload, unknown>({
    mutationFn: registerUser,
    ...options
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data: VerifyResponse) => {
      setToken(data.data.token.access, data.data.token.refresh)
      localStorage.removeItem('registered_phone');
    },
  });
}

export function useLogin(  options?: UseMutationOptions<VerifyResponse, Error, LoginPayload, unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess(data, variables, context) {
      const access = data.data.token.access;
      const refresh = data.data.token.refresh;

      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_KEY, refresh);

      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (options?.onSuccess) {(options.onSuccess as any)(data, variables, context);}
    },
    ...options,
  });
}

export function useGetMe() {
  const token = localStorage.getItem(TOKEN_KEY) ;
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  });
}

export const useLogout = () => {
  const qc = useQueryClient();

  clearToken()
  qc.removeQueries({ queryKey: ["me"] });
};
