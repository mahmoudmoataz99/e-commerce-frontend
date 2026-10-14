import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import {
  User,
  MapPin,
  CreditCard,
  Package,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { api, getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { User as UserType } from '../types';

const menuItems = [
  { label: 'Orders', path: '/orders', icon: Package },
  { label: 'Addresses', path: '/account/addresses', icon: MapPin },
  { label: 'Payment Methods', path: '/account/payments', icon: CreditCard },
  { label: 'Notifications', path: '/notifications', icon: Bell },
];

export default function Account() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout, setUser, isAuthenticated } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put<UserType>('/profile', { name, phone });
      setUser(data);
      setEditing(false);
      enqueueSnackbar('Profile updated', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    enqueueSnackbar('Logged out', { variant: 'info' });
  };

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please sign in to view your account.
        </Alert>
        <Button component={Link} to="/login" variant="contained">
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        My Account
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <List disablePadding>
              {menuItems.map((item) => (
                <ListItemButton key={item.path} component={Link} to={item.path}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon size={20} />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  <ChevronRight size={16} color="#999" />
                </ListItemButton>
              ))}
              <Divider />
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogOut size={20} />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={22} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              {!editing && (
                <Button variant="outlined" size="small" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </Box>

            {editing ? (
              <Box>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField fullWidth label="Email" value={user.email} disabled sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outlined" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Phone
                </Typography>
                <Typography sx={{ mb: 2 }}>{user.phone || 'Not set'}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
