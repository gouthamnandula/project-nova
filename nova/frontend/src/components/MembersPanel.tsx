import { useState } from "react";
import { UserMinus } from "lucide-react";
import type { ProjectMember } from "../types";
import Modal from "./Modal";
import Button from "./Button";
import { TextField } from "./Field";
import { ErrorBanner } from "./Misc";

export function MemberRow({
  member,
  isOwner,
  canManage,
  onRemove,
}: {
  member: ProjectMember;
  isOwner: boolean;
  canManage: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-line-700 bg-panel-800 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line-700 bg-hull-900 font-display text-[13px] text-ink-300">
          {member.user.name[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-[13.5px] font-medium text-ink-100">{member.user.name}</p>
          <p className="text-[12px] text-ink-600">{member.user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
            isOwner
              ? "border-signal-500/40 text-signal-400"
              : "border-line-600 text-ink-500"
          }`}
        >
          {isOwner ? "Owner" : "Member"}
        </span>
        {canManage && !isOwner && (
          <button
            onClick={onRemove}
            aria-label={`Remove ${member.user.name}`}
            title="Remove from project"
            className="rounded-md p-1.5 text-ink-600 hover:bg-alert-500/10 hover:text-alert-400"
          >
            <UserMinus size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export function AddMemberModal({
  open,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  submitting?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Enter an email address");
      return;
    }
    setError(null);
    try {
      await onSubmit(email.trim());
      setEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a member"
      description="They need an existing NOVA account to join this project."
    >
      <div className="flex flex-col gap-4">
        {error && <ErrorBanner message={error} />}
        <TextField
          label="Email address"
          type="email"
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            Add member
          </Button>
        </div>
      </div>
    </Modal>
  );
}
