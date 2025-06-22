
import { initialUsersData } from './initialData';
import { USERS_STORAGE_KEY } from '@/lib/constants';

export type User = {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  status: string;
  password?: string;
};

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getStoredUsers = (): User[] => {
  try {
    if (typeof window === 'undefined') {
      return initialUsersData;
    }
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsersData));
      return initialUsersData;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return initialUsersData;
  }
};

const setStoredUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  await delay(500);
  return getStoredUsers();
};

export const fetchUserById = async (id: string): Promise<User | undefined> => {
  await delay(500);
  const users = getStoredUsers();
  return users.find(u => u.id === id);
};

export const createUser = async (data: Omit<User, 'id' | 'status'>): Promise<User> => {
  await delay(1000);
  const users = getStoredUsers();
  const isNipExist = users.some(user => user.nip === data.nip);
  if (isNipExist) {
    throw new Error("NIP / Username sudah digunakan.");
  }
  const newUser: User = {
    ...data,
    id: `user-${Date.now()}`,
    status: 'Aktif',
  };
  const updatedUsers = [...users, newUser];
  setStoredUsers(updatedUsers);
  return newUser;
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id'>>): Promise<User> => {
  await delay(1000);
  let users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  const isNipExist = users.some(u => u.nip === data.nip && u.id !== id);
    if (isNipExist) {
        throw new Error("NIP / Username sudah digunakan oleh pengguna lain.");
    }
  
  const updatedUser = { ...users[userIndex], ...data };
  if (!data.password) {
    updatedUser.password = users[userIndex].password;
  }

  users[userIndex] = updatedUser;
  setStoredUsers(users);
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<{ id: string }> => {
  await delay(1000);
  let users = getStoredUsers();
  const updatedUsers = users.filter(u => u.id !== id);
  if (users.length === updatedUsers.length) {
      throw new Error("Pengguna tidak ditemukan untuk dihapus.");
  }
  setStoredUsers(updatedUsers);
  return { id };
};
