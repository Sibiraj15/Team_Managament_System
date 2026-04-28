import { useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/client.js";
import ConfirmDialog from "../components/layout/ConfirmDialog.jsx";
import IconButton from "../components/layout/IconButton.jsx";
import Modal from "../components/layout/Modal.jsx";
import PaginationControls from "../components/layout/PaginationControls.jsx";
import Section from "../components/layout/Section.jsx";
import ToastStack from "../components/layout/ToastStack.jsx";
import MembershipForm from "../components/memberships/MembershipForm.jsx";
import MembershipList from "../components/memberships/MembershipList.jsx";
import PermissionViewer from "../components/permissions/PermissionViewer.jsx";
import RoleForm from "../components/roles/RoleForm.jsx";
import RoleList from "../components/roles/RoleList.jsx";
import TeamForm from "../components/teams/TeamForm.jsx";
import TeamList from "../components/teams/TeamList.jsx";
import UserForm from "../components/users/UserForm.jsx";
import UserList from "../components/users/UserList.jsx";

const emptyResolvedPermissions = {
  role: null,
  roles: [],
  permissions: []
};

const menuItems = [
  { id: "overview", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "teams", label: "Teams" },
  { id: "roles", label: "Roles" },
  { id: "assignments", label: "Assignments" },
  { id: "permissions", label: "Permissions" },
  { id: "tasks", label: "Task Demo" }
];

const StatCard = ({ label, value, hint, onClick }) => (
  <button type="button" className="stat-card" onClick={onClick}>
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    <span className="stat-hint">{hint}</span>
  </button>
);

export default function Dashboard({ currentUser, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissionsCatalog, setPermissionsCatalog] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [resolvedPermissions, setResolvedPermissions] = useState(emptyResolvedPermissions);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const [userPagination, setUserPagination] = useState(null);
  const [teamPagination, setTeamPagination] = useState(null);
  const [demoTasks, setDemoTasks] = useState([]);
  const [demoTaskTitle, setDemoTaskTitle] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [editingMembership, setEditingMembership] = useState(null);
  const [editingDemoTask, setEditingDemoTask] = useState(null);
  const [demoTaskEditForm, setDemoTaskEditForm] = useState({
    title: "",
    status: "open"
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Yes",
    onConfirm: null
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [busy, setBusy] = useState({
    user: false,
    team: false,
    role: false,
    membership: false,
    updatingMembershipId: "",
    deletingMembershipId: "",
    savingRole: false,
    deletingRoleId: "",
    savingUser: false,
    savingTeam: false,
    deletingUserId: "",
    deletingTeamId: "",
    savingDemoTask: false
  });

  const pushToast = (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const dismissToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const openConfirmDialog = ({ title, message, confirmLabel = "Yes", onConfirm }) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      confirmLabel,
      onConfirm
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: "",
      message: "",
      confirmLabel: "Yes",
      onConfirm: null
    });
  };

  const handleApiError = (error, fallbackMessage = "Something went wrong") => {
    const message = error?.message || fallbackMessage;
    pushToast("error", message);

    if (error?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      onLogout();
    }
  };

  const selectedUser = useMemo(
    () => users.find((user) => user._id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const selectedTeam = useMemo(
    () => teams.find((team) => team._id === selectedTeamId) || null,
    [teams, selectedTeamId]
  );

  const loadInitialData = async () => {
    try {
      const [usersData, teamsData, rolesData, membershipsData] = await Promise.all([
        apiClient.get("/users", { page: userPage, limit: 5, search: userSearch }),
        apiClient.get("/teams", { page: teamPage, limit: 5 }),
        apiClient.get("/roles"),
        apiClient.get("/memberships")
      ]);

      setUsers(usersData.items || []);
      setUserPagination(usersData.pagination || null);
      setTeams(teamsData.items || []);
      setTeamPagination(teamsData.pagination || null);
      setRoles(rolesData.roles || []);
      setPermissionsCatalog(rolesData.permissionsCatalog || []);
      setMemberships(membershipsData || []);
    } catch (error) {
      handleApiError(error, "Failed to load dashboard data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(true);
      loadInitialData();
    }, 250);

    return () => clearTimeout(timer);
  }, [userPage, teamPage, userSearch]);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!selectedUserId || !selectedTeamId) {
        setResolvedPermissions(emptyResolvedPermissions);
        return;
      }

      setPermissionsLoading(true);
      try {
        const data = await apiClient.get("/permissions", {
          userId: selectedUserId,
          teamId: selectedTeamId
        });
        setResolvedPermissions({
          role: data.role,
          roles: data.roles || [],
          permissions: data.permissions || []
        });
      } catch (error) {
        handleApiError(error, "Failed to load permissions");
      } finally {
        setPermissionsLoading(false);
      }
    };

    loadPermissions();
  }, [selectedUserId, selectedTeamId, memberships]);

  useEffect(() => {
    const loadDemoTasks = async () => {
      if (!selectedUserId || !selectedTeamId || !resolvedPermissions.permissions.includes("VIEW_ONLY")) {
        setDemoTasks([]);
        return;
      }

      setTasksLoading(true);
      try {
        const data = await apiClient.get("/demo/tasks", {
          teamId: selectedTeamId,
          userId: selectedUserId
        });
        setDemoTasks(data.items || []);
      } catch (error) {
        setDemoTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    loadDemoTasks();
  }, [selectedUserId, selectedTeamId, resolvedPermissions.permissions.join("|")]);

  const showSuccess = (message) => pushToast("success", message);
  const showError = (message) => pushToast("error", message);

  const handleLogoutRequest = () => {
    openConfirmDialog({
      title: "Logout",
      message: "Are you sure you want to logout from the Team Management System?",
      confirmLabel: "Yes, Logout",
      onConfirm: async () => {
        closeConfirmDialog();
        onLogout();
      }
    });
  };

  const handleCreateUser = async (payload) => {
    setBusy((current) => ({ ...current, user: true }));
    try {
      await apiClient.post("/users", payload);
      setUserPage(1);
      await loadInitialData();
      showSuccess("User created successfully");
      setIsUserModalOpen(false);
      setActiveMenu("users");
      return true;
    } catch (error) {
      handleApiError(error, "Failed to create user");
      return false;
    } finally {
      setBusy((current) => ({ ...current, user: false }));
    }
  };

  const handleUpdateUser = async (payload) => {
    if (!editingUser) {
      return false;
    }

    setBusy((current) => ({ ...current, savingUser: true }));
    try {
      const updatedUser = await apiClient.patch(`/users/${editingUser._id}`, payload);
      setUsers((current) => current.map((user) => (user._id === editingUser._id ? updatedUser : user)));
      if (selectedUserId === editingUser._id) {
        setSelectedUserId(updatedUser._id);
      }
      showSuccess("User updated successfully");
      setEditingUser(null);
      return true;
    } catch (error) {
      handleApiError(error, "Failed to update user");
      return false;
    } finally {
      setBusy((current) => ({ ...current, savingUser: false }));
    }
  };

  const handleDeleteUser = async (user) => {
    openConfirmDialog({
      title: "Delete User",
      message: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      confirmLabel: "Yes, Delete",
      onConfirm: async () => {
        setBusy((current) => ({ ...current, deletingUserId: user._id }));
        try {
          await apiClient.delete(`/users/${user._id}`);
          setUsers((current) => current.filter((item) => item._id !== user._id));
          if (selectedUserId === user._id) {
            setSelectedUserId("");
          }
          showSuccess("User deleted successfully");
          closeConfirmDialog();
          await loadInitialData();
        } catch (error) {
          handleApiError(error, "Failed to delete user");
        } finally {
          setBusy((current) => ({ ...current, deletingUserId: "" }));
        }
      }
    });
  };

  const handleCreateTeam = async (payload) => {
    setBusy((current) => ({ ...current, team: true }));
    try {
      await apiClient.post("/teams", payload);
      setTeamPage(1);
      await loadInitialData();
      showSuccess("Team created successfully");
      setIsTeamModalOpen(false);
      setActiveMenu("teams");
      return true;
    } catch (error) {
      handleApiError(error, "Failed to create team");
      return false;
    } finally {
      setBusy((current) => ({ ...current, team: false }));
    }
  };

  const handleUpdateTeam = async (payload) => {
    if (!editingTeam) {
      return false;
    }

    setBusy((current) => ({ ...current, savingTeam: true }));
    try {
      const updatedTeam = await apiClient.patch(`/teams/${editingTeam._id}`, payload);
      setTeams((current) => current.map((team) => (team._id === editingTeam._id ? updatedTeam : team)));
      if (selectedTeamId === editingTeam._id) {
        setSelectedTeamId(updatedTeam._id);
      }
      showSuccess("Team updated successfully");
      setEditingTeam(null);
      return true;
    } catch (error) {
      handleApiError(error, "Failed to update team");
      return false;
    } finally {
      setBusy((current) => ({ ...current, savingTeam: false }));
    }
  };

  const handleDeleteTeam = async (team) => {
    openConfirmDialog({
      title: "Delete Team",
      message: `Are you sure you want to delete "${team.name}"? This action cannot be undone.`,
      confirmLabel: "Yes, Delete",
      onConfirm: async () => {
        setBusy((current) => ({ ...current, deletingTeamId: team._id }));
        try {
          await apiClient.delete(`/teams/${team._id}`);
          setTeams((current) => current.filter((item) => item._id !== team._id));
          if (selectedTeamId === team._id) {
            setSelectedTeamId("");
          }
          showSuccess("Team deleted successfully");
          closeConfirmDialog();
          await loadInitialData();
        } catch (error) {
          handleApiError(error, "Failed to delete team");
        } finally {
          setBusy((current) => ({ ...current, deletingTeamId: "" }));
        }
      }
    });
  };

  const handleCreateRole = async (payload) => {
    setBusy((current) => ({ ...current, role: true }));
    try {
      const createdRole = await apiClient.post("/roles", payload);
      setRoles((current) => [createdRole, ...current]);
      showSuccess("Role created successfully");
      setIsRoleModalOpen(false);
      setActiveMenu("roles");
      return true;
    } catch (error) {
      handleApiError(error, "Failed to create role");
      return false;
    } finally {
      setBusy((current) => ({ ...current, role: false }));
    }
  };

  const handleUpdateRole = async (payload) => {
    if (!editingRole) {
      return false;
    }

    setBusy((current) => ({ ...current, savingRole: true }));
    try {
      const updatedRole = await apiClient.patch(`/roles/${editingRole._id}`, payload);
      setRoles((current) => current.map((role) => (role._id === editingRole._id ? updatedRole : role)));
      showSuccess("Role updated successfully");
      setEditingRole(null);
      return true;
    } catch (error) {
      handleApiError(error, "Failed to update role");
      return false;
    } finally {
      setBusy((current) => ({ ...current, savingRole: false }));
    }
  };

  const handleDeleteRole = async (role) => {
    openConfirmDialog({
      title: "Delete Role",
      message: `Are you sure you want to delete "${role.name}"? This action cannot be undone.`,
      confirmLabel: "Yes, Delete",
      onConfirm: async () => {
        setBusy((current) => ({ ...current, deletingRoleId: role._id }));
        try {
          await apiClient.delete(`/roles/${role._id}`);
          setRoles((current) => current.filter((item) => item._id !== role._id));
          showSuccess("Role deleted successfully");
          closeConfirmDialog();
          await loadInitialData();
        } catch (error) {
          handleApiError(error, "Failed to delete role");
        } finally {
          setBusy((current) => ({ ...current, deletingRoleId: "" }));
        }
      }
    });
  };

  const handleCreateMembership = async (payload) => {
    if (!payload.userId) {
      showError("Please select a user before assigning roles");
      return;
    }

    if (!payload.teamId) {
      showError("Please select a team before assigning roles");
      return;
    }

    if (!Array.isArray(payload.roleIds) || payload.roleIds.length === 0) {
      showError("Please select at least one role");
      return;
    }

    setBusy((current) => ({ ...current, membership: true }));
    try {
      const createdMembership = await apiClient.post("/memberships", payload);
      setMemberships((current) => [createdMembership, ...current]);
      setSelectedUserId(payload.userId);
      setSelectedTeamId(payload.teamId);
      showSuccess("Roles assigned to user in team");
      setIsAssignmentModalOpen(false);
      setActiveMenu("permissions");
      return true;
    } catch (error) {
      handleApiError(error, "Failed to assign roles");
      return false;
    } finally {
      setBusy((current) => ({ ...current, membership: false }));
    }
  };

  const handleUpdateMembership = async (membershipId, roleIds) => {
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      showError("Please keep at least one role selected");
      return;
    }

    setBusy((current) => ({ ...current, updatingMembershipId: membershipId }));
    try {
      const updatedMembership = await apiClient.patch(`/memberships/${membershipId}`, { roleIds });
      setMemberships((current) =>
        current.map((membership) => (membership._id === membershipId ? updatedMembership : membership))
      );
      showSuccess("Membership roles updated");
    } catch (error) {
      handleApiError(error, "Failed to update membership");
    } finally {
      setBusy((current) => ({ ...current, updatingMembershipId: "" }));
    }
  };

  const handleDeleteMembership = async (membershipId) => {
    setBusy((current) => ({ ...current, deletingMembershipId: membershipId }));
    try {
      await apiClient.delete(`/memberships/${membershipId}`);
      setMemberships((current) => current.filter((membership) => membership._id !== membershipId));
      showSuccess("Membership removed");
    } catch (error) {
      handleApiError(error, "Failed to remove membership");
    } finally {
      setBusy((current) => ({ ...current, deletingMembershipId: "" }));
    }
  };

  const handleDeleteMembershipCard = async (membership) => {
    openConfirmDialog({
      title: "Delete Assignment",
      message: `Are you sure you want to remove the assignment for "${membership.userId?.name || "this user"}" in "${membership.teamId?.name || "this team"}"?`,
      confirmLabel: "Yes, Remove",
      onConfirm: async () => {
        await handleDeleteMembership(membership._id);
        closeConfirmDialog();
      }
    });
  };

  const handleUpdateMembershipFromModal = async (payload) => {
    if (!editingMembership) {
      return false;
    }

    if (!Array.isArray(payload.roleIds) || payload.roleIds.length === 0) {
      showError("Please keep at least one role selected");
      return false;
    }

    setBusy((current) => ({ ...current, updatingMembershipId: editingMembership._id }));
    try {
      const updatedMembership = await apiClient.patch(`/memberships/${editingMembership._id}`, {
        roleIds: payload.roleIds
      });
      setMemberships((current) =>
        current.map((membership) =>
          membership._id === editingMembership._id ? updatedMembership : membership
        )
      );
      showSuccess("Assignment updated successfully");
      setEditingMembership(null);
      return true;
    } catch (error) {
      handleApiError(error, "Failed to update assignment");
      return false;
    } finally {
      setBusy((current) => ({ ...current, updatingMembershipId: "" }));
    }
  };

  const handleCreateDemoTask = async () => {
    if (!demoTaskTitle.trim() || !selectedUserId || !selectedTeamId) {
      if (!selectedUserId) {
        showError("Select a user before creating a task");
        return;
      }

      showError(!selectedTeamId ? "Select a team before creating a task" : "Task title cannot be empty");
      return;
    }

    if (!resolvedPermissions.permissions.includes("CREATE_TASK")) {
      showError("You do not have CREATE_TASK permission in this team");
      return;
    }

    try {
      const task = await apiClient.post(`/demo/tasks?teamId=${selectedTeamId}&userId=${selectedUserId}`, {
        title: demoTaskTitle
      });
      setDemoTasks((current) => [task, ...current]);
      setDemoTaskTitle("");
      showSuccess("Demo task created");
    } catch (error) {
      handleApiError(error, "Failed to create demo task");
    }
  };

  const handleDeleteDemoTask = async (taskId) => {
    if (!selectedUserId || !selectedTeamId) {
      showError(!selectedUserId ? "Select a user before deleting a task" : "Select a team before deleting a task");
      return;
    }

    if (!resolvedPermissions.permissions.includes("DELETE_TASK")) {
      showError("You do not have DELETE_TASK permission in this team");
      return;
    }

    openConfirmDialog({
      title: "Delete Task",
      message: "Are you sure you want to delete this demo task?",
      confirmLabel: "Yes, Delete",
      onConfirm: async () => {
        try {
          await apiClient.delete(`/demo/tasks/${taskId}?teamId=${selectedTeamId}&userId=${selectedUserId}`);
          setDemoTasks((current) => current.filter((task) => task.id !== taskId));
          showSuccess("Demo task deleted");
          closeConfirmDialog();
        } catch (error) {
          handleApiError(error, "Failed to delete demo task");
        }
      }
    });
  };

  const openEditDemoTask = (task) => {
    if (!resolvedPermissions.permissions.includes("EDIT_TASK")) {
      showError("You do not have EDIT_TASK permission in this team");
      return;
    }

    setEditingDemoTask(task);
    setDemoTaskEditForm({
      title: task.title,
      status: task.status
    });
  };

  const handleUpdateDemoTask = async (event) => {
    event.preventDefault();

    if (!editingDemoTask) {
      return;
    }

    if (!selectedUserId || !selectedTeamId) {
      showError(!selectedUserId ? "Select a user before editing a task" : "Select a team before editing a task");
      return;
    }

    if (!demoTaskEditForm.title.trim()) {
      showError("Task title cannot be empty");
      return;
    }

    setBusy((current) => ({ ...current, savingDemoTask: true }));
    try {
      const updatedTask = await apiClient.patch(
        `/demo/tasks/${editingDemoTask.id}?teamId=${selectedTeamId}&userId=${selectedUserId}`,
        {
          title: demoTaskEditForm.title,
          status: demoTaskEditForm.status
        }
      );

      setDemoTasks((current) =>
        current.map((task) => (task.id === editingDemoTask.id ? updatedTask : task))
      );
      setEditingDemoTask(null);
      showSuccess("Demo task updated");
    } catch (error) {
      handleApiError(error, "Failed to update demo task");
    } finally {
      setBusy((current) => ({ ...current, savingDemoTask: false }));
    }
  };

  const renderOverview = () => (
    <div className="content-stack">
      <div className="stat-grid">
        <StatCard
          label="Managed Users"
          value={userPagination?.totalItems ?? users.length}
          hint="Create and search project users"
          onClick={() => setActiveMenu("users")}
        />
        <StatCard
          label="Teams"
          value={teamPagination?.totalItems ?? teams.length}
          hint="Organize access by team"
          onClick={() => setActiveMenu("teams")}
        />
        <StatCard
          label="Roles"
          value={roles.length}
          hint="Reusable permission bundles"
          onClick={() => setActiveMenu("roles")}
        />
        <StatCard
          label="Assignments"
          value={memberships.length}
          hint="User-team role mappings"
          onClick={() => setActiveMenu("assignments")}
        />
      </div>

      <Section
        title="Welcome Back"
        subtitle="Use the menu to manage the system module by module instead of working on one crowded page."
      >
        <div className="overview-grid">
          <article className="info-panel">
            <h3>Recommended Flow</h3>
            <ol className="simple-list">
              <li>Create managed users</li>
              <li>Create teams</li>
              <li>Create reusable roles</li>
              <li>Assign one or more roles within a team</li>
              <li>Open Permissions to verify the resolved access</li>
            </ol>
          </article>
          <article className="info-panel">
            <h3>Current Selection</h3>
            <div className="selection-summary">
              <div className="selection-summary-item">
                <span className="meta-label">Selected user</span>
                <strong>{selectedUser?.name || "No user selected"}</strong>
              </div>
              <div className="selection-summary-item">
                <span className="meta-label">Selected team</span>
                <strong>{selectedTeam?.name || "No team selected"}</strong>
              </div>
              <div className="selection-summary-item">
                <span className="meta-label">Resolved roles</span>
                <strong>
                  {resolvedPermissions.roles.length
                    ? resolvedPermissions.roles.map((role) => role.name).join(", ")
                    : "No roles yet"}
                </strong>
              </div>
            </div>
          </article>
        </div>
      </Section>
    </div>
  );

  const renderUsers = () => (
    <Section
      title="User Management"
      subtitle="Create managed users and choose one for team-based permission resolution."
      action={
        <div className="section-tools">
          <input
            className="search-input"
            value={userSearch}
            onChange={(event) => {
              setUserPage(1);
              setUserSearch(event.target.value);
            }}
            placeholder="Search name or email"
          />
          <button type="button" onClick={() => setIsUserModalOpen(true)}>
            Create User
          </button>
        </div>
      }
    >
      <UserList
        users={users}
        selectedUserId={selectedUserId}
        onSelect={setSelectedUserId}
        onEdit={setEditingUser}
        onDelete={handleDeleteUser}
        deletingId={busy.deletingUserId}
      />
      <PaginationControls pagination={userPagination} onPageChange={setUserPage} />
    </Section>
  );

  const renderTeams = () => (
    <Section
      title="Team Management"
      subtitle="Create teams and pick one to inspect roles and permissions."
      action={
        <button type="button" onClick={() => setIsTeamModalOpen(true)}>
          Create Team
        </button>
      }
    >
      <TeamList
        teams={teams}
        selectedTeamId={selectedTeamId}
        onSelect={setSelectedTeamId}
        onEdit={setEditingTeam}
        onDelete={handleDeleteTeam}
        deletingId={busy.deletingTeamId}
      />
      <PaginationControls pagination={teamPagination} onPageChange={setTeamPage} />
    </Section>
  );

  const renderRoles = () => (
    <Section
      title="Role Management"
      subtitle="Create reusable permission bundles and maintain them from a clean admin grid."
      action={
        <button type="button" onClick={() => setIsRoleModalOpen(true)}>
          Create Role
        </button>
      }
    >
      <RoleList
        roles={roles}
        onEdit={setEditingRole}
        onDelete={handleDeleteRole}
        deletingId={busy.deletingRoleId}
      />
    </Section>
  );

  const renderAssignments = () => (
    <Section
      title="Role Assignments"
      subtitle="Review user-team access mappings with a cleaner operational layout."
      action={
        <button type="button" onClick={() => setIsAssignmentModalOpen(true)}>
          Create Assignment
        </button>
      }
    >
      <MembershipList
        memberships={memberships}
        onEdit={setEditingMembership}
        onDelete={handleDeleteMembershipCard}
        deletingId={busy.deletingMembershipId}
      />
    </Section>
  );

  const renderPermissions = () => (
    <Section
      title="Resolved Permissions"
      subtitle="Permissions are merged from all selected roles inside the selected team."
    >
      <PermissionViewer
        selectedUser={selectedUser}
        selectedTeam={selectedTeam}
        resolvedPermissions={resolvedPermissions}
        loading={permissionsLoading}
      />
    </Section>
  );

  const renderTasks = () => (
    <Section
      title="Permission Guard Demo"
      subtitle="These task actions are protected by backend permission middleware."
    >
      <div className="inline-controls compact">
        <input
          value={demoTaskTitle}
          onChange={(event) => setDemoTaskTitle(event.target.value)}
          placeholder="New task title"
          disabled={!resolvedPermissions.permissions.includes("CREATE_TASK")}
        />
        <button
          type="button"
          onClick={handleCreateDemoTask}
          disabled={!resolvedPermissions.permissions.includes("CREATE_TASK")}
        >
          Create Task
        </button>
      </div>

      {tasksLoading ? <div className="empty-panel">Loading tasks...</div> : null}

      <div className="task-list">
        {demoTasks.length ? (
          demoTasks.map((task) => (
            <article key={task.id} className="task-row-card">
              <div className="task-row-main">
                <strong>{task.title}</strong>
                <span className={`task-status task-status-${task.status}`}>
                  {task.status.replace("_", " ")}
                </span>
              </div>
              <div className="icon-row task-card-actions">
                <IconButton
                  icon="edit"
                  title={
                    resolvedPermissions.permissions.includes("EDIT_TASK")
                      ? "Edit permission available"
                      : "Edit permission not available"
                  }
                  onClick={() => openEditDemoTask(task)}
                  disabled={!resolvedPermissions.permissions.includes("EDIT_TASK")}
                />
                <IconButton
                  icon="delete"
                  title="Delete task"
                  tone="danger"
                  onClick={() => handleDeleteDemoTask(task.id)}
                  disabled={!resolvedPermissions.permissions.includes("DELETE_TASK")}
                />
              </div>
            </article>
          ))
        ) : (
          <div className="empty-panel">
            No demo tasks available for the current team selection.
          </div>
        )}
      </div>
    </Section>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "users":
        return renderUsers();
      case "teams":
        return renderTeams();
      case "roles":
        return renderRoles();
      case "assignments":
        return renderAssignments();
      case "permissions":
        return renderPermissions();
      case "tasks":
        return renderTasks();
      default:
        return renderOverview();
    }
  };

  const activeLabel = menuItems.find((item) => item.id === activeMenu)?.label || "Dashboard";

  if (pageLoading) {
    return <div className="app-loading">Loading dashboard...</div>;
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">TM</span>
          <div>
            <strong>Team Manager</strong>
            <p>RBAC control center</p>
          </div>
        </div>

        <nav className="menu-list">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`menu-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => setActiveMenu(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="meta-label">Signed in</span>
          <strong>{currentUser.name}</strong>
          <span className="muted-text">{currentUser.email}</span>
          <button type="button" className="secondary-button" onClick={handleLogoutRequest}>
            Logout
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div>
            <p className="workspace-kicker">Management Console</p>
            <h1>{activeLabel}</h1>
          </div>
          <div className="header-chip">
            {selectedUser?.name || "No user selected"} {selectedTeam?.name ? `- ${selectedTeam.name}` : ""}
          </div>
        </header>

        {renderContent()}
      </section>

      <Modal open={isUserModalOpen} title="Create User" onClose={() => setIsUserModalOpen(false)}>
        <UserForm onSubmit={handleCreateUser} loading={busy.user} />
      </Modal>

      <Modal open={isTeamModalOpen} title="Create Team" onClose={() => setIsTeamModalOpen(false)}>
        <TeamForm onSubmit={handleCreateTeam} loading={busy.team} />
      </Modal>

      <Modal open={isRoleModalOpen} title="Create Role" onClose={() => setIsRoleModalOpen(false)}>
        <RoleForm
          onSubmit={handleCreateRole}
          loading={busy.role}
          permissionsCatalog={permissionsCatalog}
        />
      </Modal>

      <Modal
        open={isAssignmentModalOpen}
        title="Create Assignment"
        onClose={() => setIsAssignmentModalOpen(false)}
      >
        <MembershipForm
          users={users}
          teams={teams}
          roles={roles}
          onSubmit={handleCreateMembership}
          loading={busy.membership}
          selectedUserId={selectedUserId}
          selectedTeamId={selectedTeamId}
          submitLabel="Create Assignment"
        />
      </Modal>

      <Modal open={Boolean(editingUser)} title="Edit User" onClose={() => setEditingUser(null)}>
        <UserForm
          onSubmit={handleUpdateUser}
          loading={busy.savingUser}
          initialValues={{
            name: editingUser?.name || "",
            email: editingUser?.email || ""
          }}
          submitLabel="Update User"
        />
      </Modal>

      <Modal open={Boolean(editingTeam)} title="Edit Team" onClose={() => setEditingTeam(null)}>
        <TeamForm
          onSubmit={handleUpdateTeam}
          loading={busy.savingTeam}
          initialValues={{
            name: editingTeam?.name || "",
            description: editingTeam?.description || ""
          }}
          submitLabel="Update Team"
        />
      </Modal>

      <Modal open={Boolean(editingRole)} title="Edit Role" onClose={() => setEditingRole(null)}>
        <RoleForm
          onSubmit={handleUpdateRole}
          loading={busy.savingRole}
          permissionsCatalog={permissionsCatalog}
          initialValues={{
            name: editingRole?.name || "",
            description: editingRole?.description || "",
            permissions: editingRole?.permissions || []
          }}
          submitLabel="Update Role"
        />
      </Modal>

      <Modal
        open={Boolean(editingMembership)}
        title="Edit Assignment"
        onClose={() => setEditingMembership(null)}
      >
        <MembershipForm
          users={users}
          teams={teams}
          roles={roles}
          onSubmit={handleUpdateMembershipFromModal}
          loading={busy.updatingMembershipId === editingMembership?._id}
          selectedUserId={selectedUserId}
          selectedTeamId={selectedTeamId}
          initialValues={{
            userId: editingMembership?.userId?._id || "",
            teamId: editingMembership?.teamId?._id || "",
            roleIds: (editingMembership?.roleIds || []).map((role) => role._id || role)
          }}
          submitLabel="Update Assignment"
          lockUser
          lockTeam
        />
      </Modal>

      <Modal
        open={Boolean(editingDemoTask)}
        title="Edit Task"
        onClose={() => setEditingDemoTask(null)}
      >
        <form className="form-grid" onSubmit={handleUpdateDemoTask}>
          <label className="full-width">
            <span>Task title <span className="required-mark">*</span></span>
            <input
              value={demoTaskEditForm.title}
              onChange={(event) =>
                setDemoTaskEditForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Enter task title"
              required
            />
          </label>

          <label className="full-width">
            <span>Status <span className="required-mark">*</span></span>
            <select
              value={demoTaskEditForm.status}
              onChange={(event) =>
                setDemoTaskEditForm((current) => ({ ...current, status: event.target.value }))
              }
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <div className="full-width form-actions">
            <button type="submit" disabled={busy.savingDemoTask}>
              {busy.savingDemoTask ? "Saving..." : "Update Task"}
            </button>
          </div>
        </form>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        onConfirm={async () => {
          if (confirmDialog.onConfirm) {
            await confirmDialog.onConfirm();
          }
        }}
        onCancel={closeConfirmDialog}
        loading={Boolean(
          busy.deletingUserId ||
            busy.deletingTeamId ||
            busy.deletingRoleId ||
            busy.deletingMembershipId
        )}
      />
    </main>
  );
}
