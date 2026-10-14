import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  alpha,
  Container,
} from '@mui/material';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'New Arrivals', path: '/shop?tag=new' },
  { label: 'Sale', path: '/shop?tag=sale' },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
      setSearch('');
    }
  };

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 1 }}>
            {/* Mobile menu */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} edge="start" aria-label="menu">
                <Menu size={22} />
              </IconButton>
            )}

            {/* Logo */}
            <Typography
              component={Link}
              to="/"
              variant="h5"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: 'text.primary',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                mr: { md: 4 },
                flexShrink: 0,
              }}
            >
              E-Commerce
            </Typography>

            {/* Desktop nav */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    color="inherit"
                    sx={{
                      fontWeight: location.pathname === link.path.split('?')[0] ? 600 : 400,
                      color: location.pathname === link.path.split('?')[0] ? 'text.primary' : 'text.secondary',
                      '&:hover': { color: 'text.primary', bgcolor: alpha('#1a1a1a', 0.04) },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flex: 1 }} />

            {/* Search */}
            {(searchOpen || !isMobile) && (
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: alpha('#1a1a1a', 0.04),
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  width: { xs: '100%', sm: 220, md: 260 },
                  position: { xs: 'absolute', md: 'relative' },
                  left: { xs: 0, md: 'auto' },
                  right: { xs: 0, md: 'auto' },
                  top: { xs: 64, md: 'auto' },
                  mx: { xs: 2, md: 0 },
                  zIndex: 10,
                  border: '1px solid',
                  borderColor: alpha('#1a1a1a', 0.08),
                }}
              >
                <Search size={18} color="#6b6b6b" />
                <InputBase
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: 14 }}
                  autoFocus={searchOpen}
                />
                {isMobile && (
                  <IconButton size="small" onClick={() => setSearchOpen(false)}>
                    <X size={16} />
                  </IconButton>
                )}
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isMobile && (
                <IconButton onClick={() => setSearchOpen(!searchOpen)} aria-label="search">
                  <Search size={20} />
                </IconButton>
              )}

              {isAuthenticated && (
                <IconButton component={Link} to="/notifications" aria-label="notifications">
                  <Bell size={20} />
                </IconButton>
              )}

              <IconButton component={Link} to="/wishlist" aria-label="wishlist">
                <Badge badgeContent={wishlistCount} color="secondary" max={99}>
                  <Heart size={20} />
                </Badge>
              </IconButton>

              <IconButton component={Link} to="/cart" aria-label="cart">
                <Badge badgeContent={cartCount} color="secondary" max={99}>
                  <ShoppingBag size={20} />
                </Badge>
              </IconButton>

              <IconButton
                component={Link}
                to={isAuthenticated ? '/account' : '/login'}
                aria-label="account"
              >
                <User size={20} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
              E-Commerce
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {isAuthenticated ? (
              <>
                <ListItemButton component={Link} to="/account" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="My Account" />
                </ListItemButton>
                <ListItemButton component={Link} to="/orders" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Orders" />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    logout();
                    setDrawerOpen(false);
                    navigate('/');
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Sign In" />
              </ListItemButton>
            )}
          </List>
          {isAuthenticated && user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, px: 2 }}>
              Signed in as {user.name}
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}
