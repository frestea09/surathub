
"use client";

import useSWR from 'swr';
import { fetchUsers, fetchUserById, User } from '@/data/users';

const USERS_KEY = '/api/users';

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(USERS_KEY, fetchUsers);

  return {
    users: data,
    isLoading,
    error,
    mutate,
  };
}

export function useUser(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR<User | undefined>(
        id ? `${USERS_KEY}/${id}` : null, 
        () => id ? fetchUserById(id) : undefined
    );

    return {
        user: data,
        isLoading,
        error,
        mutate,
    };
}
