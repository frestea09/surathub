
import create from 'zustand';
import { USERS_STORAGE_KEY } from '@/lib/constants';

export type User = {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  status: string;
  password?: string;
};

const initialUsersData: User[] = [
  {
    id: "dir-01",
    nip: "196711022002121001",
    nama: "dr. H. Yani Sumpena Muchtar, SH, MH.Kes",
    jabatan: "Direktur",
    status: "Aktif",
    password: "password-direktur",
  },
  {
    id: "ppk-01",
    nip: "198408272008011005",
    nama: "Saep Trian Prasetia.S.Si.Apt",
    jabatan: "Pejabat Pembuat Komitmen",
    status: "Aktif",
    password: "password-ppk",
  },
  {
    id: "ppbj-01",
    nip: "197711042005042013",
    nama: "Deti Hapitri, A.Md.Gz",
    jabatan: "Pejabat Pengadaan Barang Jasa",
    status: "Aktif",
    password: "password-ppbj",
  },
  {
    id: "admin-01",
    nip: "admin",
    nama: "Admin Utama",
    jabatan: "Administrator Sistem",
    status: "Aktif",
    password: "password-admin",
  },
  {
    id: "keu-01",
    nip: "198001012005012002",
    nama: "Jane Doe",
    jabatan: "Kepala Bagian Keuangan",
    status: "Aktif",
    password: "password-keuangan",
  },
  {
    id: "umum-01",
    nip: "198203152006041001",
    nama: "Budi Darmawan",
    jabatan: "Kepala Bagian Umum",
    status: "Non-Aktif",
    password: "password-umum",
  },
   {
    id: "yanmed-01",
    nip: "197505202003122001",
    nama: "Dr. Anisa Fitriani, Sp.A",
    jabatan: "Kepala Bidang Pelayanan Medik",
    status: "Aktif",
    password: "password-yanmed",
  },
];


type UserState = {
    users: User[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => void;
    addUser: (data: Omit<User, 'id' | 'status'>) => Promise<void>;
    updateUser: (id: string, data: Partial<Omit<User, 'id'>>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

const getStoredUsers = (): User[] => {
  try {
    if (typeof window === 'undefined') return initialUsersData;
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

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: true,
  error: null,

  fetchUsers: () => {
    set({ isLoading: true, error: null });
    try {
      const users = getStoredUsers();
      set({ users, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  addUser: async (data) => {
    const { users } = get();
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
    set({ users: updatedUsers });
  },

  updateUser: async (id, data) => {
    let users = get().users;
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
    set({ users: [...users] });
  },

  deleteUser: async (id) => {
    let users = get().users;
    const updatedUsers = users.filter(u => u.id !== id);
    if (users.length === updatedUsers.length) {
        throw new Error("Pengguna tidak ditemukan untuk dihapus.");
    }
    setStoredUsers(updatedUsers);
    set({ users: updatedUsers });
  },
}));
