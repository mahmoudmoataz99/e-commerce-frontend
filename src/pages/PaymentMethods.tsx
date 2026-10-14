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
  MenuItem,
} from '@mui/material';
import { Plus, Trash2, CreditCard, Star } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { api, getErrorMessage } from '../api/client';
import type { PaymentMethod } from '../types';
import EmptyState from '../components/EmptyState';

export default function PaymentMethods() {
  const { enqueueSnackbar } = useSnackbar();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [last4, setLast4] = useState('');
  const [type, setType] = useState('card');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get<PaymentMethod[]>('/payment-methods');
      setMethods(data);
    } catch {
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!label.trim() || last4.length !== 4) return;
    setSaving(true);
    try {
      await api.post('/payment-methods', { label, last4, type });
      enqueueSnackbar('Payment method added', { variant: 'success' });
      setDialogOpen(false);
      setLabel('');
      setLast4('');
      load();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/payment-methods/${id}`);
      enqueueSnackbar('Removed', { variant: 'success' });
      load();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.put(`/payment-methods/${id}/default`);
      enqueueSnackbar('Default updated', { variant: 'success' });
      load();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Payment Methods
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setDialogOpen(true)}
        >
          Add
        </Button>
      </Box>

      {loading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} height={80} sx={{ mb: 2, borderRadius: 2 }} />
        ))
      ) : methods.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment methods"
          description="Add a card for faster checkout."
        />
      ) : (
        methods.map((m) => (
          <Paper
            key={m.id}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CreditCard size={24} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={600}>
                    {m.label} •••• {m.last4}
                  </Typography>
                  {m.is_default && <Chip label="Default" size="small" color="secondary" />}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {m.type}
                </Typography>
              </Box>
            </Box>
            <Box>
              {!m.is_default && (
                <IconButton size="small" onClick={() => handleSetDefault(m.id)} title="Set as default">
                  <Star size={16} />
                </IconButton>
              )}
              <IconButton size="small" color="error" onClick={() => handleDelete(m.id)}>
                <Trash2 size={16} />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            placeholder="Visa, Mastercard..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Last 4 digits"
            value={last4}
            onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 4 }}
          />
          <TextField
            fullWidth
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="card">Card</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving || last4.length !== 4}>
            {saving ? 'Saving...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
