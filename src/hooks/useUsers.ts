
"use client";

import useSWR from 'swr';
import { fetchUsers, fetchUserById, User } from '@/data/users';

const USERS_KEY = '/api/users';

const userFetcher = async () => {
    return fetchUsers();
};

const userByIdFetcher = async (url: string) => {
    const id = url.split('/').pop();
    if (!id) return undefined;
    return fetchUserById(id);
};

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(USERS_KEY, userFetcher);

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
        userByIdFetcher
    );

    return {
        user: data,
        isLoading,
        error,
        mutate,
    };
}
