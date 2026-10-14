import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a1a',
        color: '#fff',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 2 }}
            >
              E-Commerce
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 300, mb: 3 }}>
              Premium fashion and lifestyle essentials. Curated collections for the modern wardrobe.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#c9a86c' } }}
                >
                  <Icon size={18} />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, letterSpacing: 0.5 }}>
              SHOP
            </Typography>
            {['All Products', 'New Arrivals', 'Bestsellers', 'Sale'].map((label) => (
              <MuiLink
                key={label}
                component={Link}
                to="/shop"
                underline="none"
                display="block"
                sx={{ color: 'rgba(255,255,255,0.65)', mb: 1, fontSize: 14, '&:hover': { color: '#c9a86c' } }}
              >
                {label}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, letterSpacing: 0.5 }}>
              HELP
            </Typography>
            {['Shipping', 'Returns', 'Size Guide', 'Contact'].map((label) => (
              <MuiLink
                key={label}
                href="#"
                underline="none"
                display="block"
                sx={{ color: 'rgba(255,255,255,0.65)', mb: 1, fontSize: 14, '&:hover': { color: '#c9a86c' } }}
              >
                {label}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, letterSpacing: 0.5 }}>
              NEWSLETTER
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mb: 2 }}>
              Subscribe for exclusive offers and new arrivals.
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ display: 'flex', gap: 1 }}
            >
              <Box
                component="input"
                placeholder="Your email"
                sx={{
                  flex: 1,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 1.5,
                  px: 2,
                  py: 1.2,
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                  '&:focus': { borderColor: '#c9a86c' },
                }}
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  bgcolor: '#c9a86c',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: 1.5,
                  px: 2.5,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#e0c48a' },
                }}
              >
                Join
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service'].map((t) => (
              <MuiLink
                key={t}
                href="#"
                underline="none"
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.45)', '&:hover': { color: '#c9a86c' } }}
              >
                {t}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
