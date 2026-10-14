import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Skeleton,
  IconButton,
} from '@mui/material';
import { Bell, Check } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { api, getErrorMessage } from '../api/client';
import type { AppNotification } from '../types';
import EmptyState from '../components/EmptyState';

export default function Notifications() {
  const { enqueueSnackbar } = useSnackbar();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get<AppNotification[]>('/notifications');
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      enqueueSnackbar('All marked as read', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Notifications
        </Typography>
        {unread > 0 && (
          <Button size="small" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </Box>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={80} sx={{ mb: 2, borderRadius: 2 }} />
        ))
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        notifications.map((n) => (
          <Paper
            key={n.id}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 1.5,
              border: '1px solid',
              borderColor: n.is_read ? 'divider' : 'secondary.main',
              borderRadius: 2,
              bgcolor: n.is_read ? 'background.paper' : 'rgba(201, 168, 108, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography fontWeight={n.is_read ? 500 : 700}>{n.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {n.body}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {new Date(n.created_at).toLocaleString()}
              </Typography>
            </Box>
            {!n.is_read && (
              <IconButton size="small" onClick={() => markRead(n.id)} title="Mark as read">
                <Check size={16} />
              </IconButton>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
