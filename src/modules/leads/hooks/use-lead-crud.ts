import { useState } from 'react';
import { Leads } from '../services/leads';

export function useLeadCrud() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<{
    id: string;
    values: { name: string; last_name: string; email: string; program_id: string };
  } | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingLead(null);
    setFormOpen(true);
  };

  const handleEdit = async (id: string) => {
    const lead = await Leads.getById(id);
    setEditingLead({
      id,
      values: {
        name: lead.name,
        last_name: lead.last_name,
        email: lead.email,
        program_id: lead.program_id,
      },
    });
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingLeadId(id);
    setDeleteOpen(true);
  };

  return {
    formOpen,
    setFormOpen,
    editingLead,
    deleteOpen,
    setDeleteOpen,
    deletingLeadId,
    handleCreate,
    handleEdit,
    handleDelete,
  };
}
