"use client";

import { useActionState } from "react";
import { UserRole, UserStatus } from "@prisma/client";
import { updateUser, type UserState } from "../actions";

type UserUpdateFormProps = {
  userId: number;
  currentRole: UserRole;
  currentStatus: UserStatus;
  isCurrentAdmin: boolean;
};

const initialState: UserState = {};

export default function UserUpdateForm({
  userId,
  currentRole,
  currentStatus,
  isCurrentAdmin,
}: UserUpdateFormProps) {
  const [state, action, pending] = useActionState(updateUser, initialState);

  return (
    <form action={action} className="mt-4 space-y-4 rounded-lg border p-4">
      <input type="hidden" name="userId" value={userId} />

      <div>
        <label htmlFor={`role-${userId}`} className="mb-2 block text-sm font-medium">
          Rol
        </label>
        <select
          id={`role-${userId}`}
          name="role"
          defaultValue={currentRole}
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value={UserRole.CLIENT}>CLIENT</option>
          <option value={UserRole.ADMIN}>ADMIN</option>
        </select>
      </div>

      <div>
        <label htmlFor={`status-${userId}`} className="mb-2 block text-sm font-medium">
          Estado
        </label>
        <select
          id={`status-${userId}`}
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-lg border px-4 py-3"
          disabled={isCurrentAdmin}
        >
          <option value={UserStatus.ACTIVE}>ACTIVE</option>
          <option value={UserStatus.BLOCKED}>BLOCKED</option>
        </select>
      </div>

      {isCurrentAdmin ? (
        <p className="text-sm text-gray-500">
          No puedes bloquear tu propia cuenta desde este panel.
        </p>
      ) : null}

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      {state?.success ? (
        <p className="text-sm text-green-600">{state.success}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}