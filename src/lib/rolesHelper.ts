import { ROLES } from './constants';
import type { User } from '@/store/userStore';

// A map to quickly find a role's group and leadership status.
// We are building a cache for quick lookups.
const roleDetails = new Map<string, { group: string; isLeader: boolean; members: string[] }>();

// Pre-process the ROLES constant to build the lookup map.
Object.entries(ROLES).forEach(([group, rolesInGroup]) => {
    rolesInGroup.forEach((role, index) => {
        // The first person in the list is the leader.
        const isLeader = index === 0;
        roleDetails.set(role, { group, isLeader, members: rolesInGroup });
    });
});

/**
 * Gets the list of users that the current user is allowed to view based on a simple hierarchy.
 * @param activeUser The currently logged-in user.
 * @param allMockUsers The complete list of all mock users to filter from.
 * @returns A filtered list of users for the "View As" dropdown.
 */
export const getVisibleUsers = (activeUser: User | null, allMockUsers: User[]): User[] => {
    if (!activeUser) {
        return [];
    }

    const { jabatan: currentUserRole } = activeUser;

    // Super admins (Direktur, Administrator Sistem) can see everyone.
    if (currentUserRole === 'Administrator Sistem' || currentUserRole === 'Direktur') {
        return allMockUsers;
    }

    const details = roleDetails.get(currentUserRole);

    // If the user is a defined leader, they can see everyone in their group.
    if (details?.isLeader) {
        const groupName = details.group as keyof typeof ROLES;
        // Also include "Pimpinan & Pengawas" so leaders can see director-level views
        const pimpinanRoles = ROLES["Pimpinan & Pengawas"] || [];
        const rolesInGroup = [...(ROLES[groupName] || []), ...pimpinanRoles];
        
        return allMockUsers.filter(u => rolesInGroup.includes(u.jabatan));
    }

    // For any other case (regular staff or role not found in the hierarchy), they can only see themselves.
    return allMockUsers.filter(u => u.jabatan === currentUserRole);
};
