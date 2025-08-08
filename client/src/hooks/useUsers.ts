import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../lib/api';
import type { User, UpdateUserRequest } from "../types/api";

const QUERY_KEYS = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: usersApi.getAll,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserRequest }) =>
      usersApi.update(id, userData),
    onSuccess: (updatedUser, { id }) => {
      queryClient.setQueryData(QUERY_KEYS.user(id), updatedUser);
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.users },
        (oldData: User[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          );
        }
      );
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.users },
        (oldData: User[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((user) => user.id !== deletedId);
        }
      );
      queryClient.removeQueries({ queryKey: QUERY_KEYS.user(deletedId) });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
} 