import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Skeleton,
} from '@mui/material';
import { Plus, Trash2, MapPin, Pencil } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { api, getErrorMessage } from '../api/client';
import type { Address } from '../types';
import EmptyState from '../components/EmptyState';

export default function Addresses() {
  const { enqueueSnackbar } = useSnackbar();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get<Address[]>('/addresses');
      setAddresses(data);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setLabel('');
    setAddress('');
    setDialogOpen(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setLabel(a.label);
    setAddress(a.address);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!label.trim() || !address.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/addresses/${editing.id}`, { label, address });
        enqueueSnackbar('Address updated', { variant: 'success' });
      } else {
        await api.post('/addresses', { label, address });
        enqueueSnackbar('Address added', { variant: 'success' });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/addresses/${id}`);
      enqueueSnackbar('Address deleted', { variant: 'success' });
      load();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Addresses
        </Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={openAdd}>
          Add
        </Button>
      </Box>

      {loading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} height={100} sx={{ mb: 2, borderRadius: 2 }} />
        ))
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses"
          description="Add a shipping address for faster checkout."
          actionLabel="Add Address"
          actionTo="#"
        />
      ) : (
        addresses.map((a) => (
          <Paper
            key={a.id}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography fontWeight={600}>{a.label}</Typography>
                {a.is_default && <Chip label="Default" size="small" color="secondary" />}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {a.address}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" onClick={() => openEdit(a)}>
                <Pencil size={16} />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => handleDelete(a.id)}>
                <Trash2 size={16} />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Address' : 'Add Address'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            placeholder="Home, Work..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Full address"
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
