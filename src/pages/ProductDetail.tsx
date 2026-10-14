import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Rating,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Skeleton,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Heart, ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { api } from '../api/client';
import type { Product } from '../types';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCart = useCartStore((s) => s.addToCart);
  const { isInWishlist, toggle } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<Product>(`/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        if (r.data.sizes?.length) setSize(r.data.sizes[0]);
        if (r.data.colors?.length) setColor(r.data.colors[0]);
        // related
        if (r.data.category?.slug) {
          api
            .get<Product[]>(`/products?category=${r.data.category.slug}`)
            .then((rel) => setRelated(rel.data.filter((p) => p.id !== r.data.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity, size || undefined, color || undefined);
      enqueueSnackbar('Added to cart', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed', { variant: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const nowIn = await toggle(product.id);
      enqueueSnackbar(nowIn ? 'Added to wishlist' : 'Removed from wishlist', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width="40%" height={24} />
            <Skeleton width="80%" height={40} sx={{ mt: 1 }} />
            <Skeleton width="30%" height={28} sx={{ mt: 2 }} />
            <Skeleton height={80} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Product not found</Typography>
        <Button component={Link} to="/shop" startIcon={<ArrowLeft size={18} />}>
          Back to Shop
        </Button>
      </Container>
    );
  }

  const price = Number(product.price);
  const original = product.original_price ? Number(product.original_price) : null;
  const discount =
    original && original > price ? Math.round(((original - price) / original) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">Home</MuiLink>
        <MuiLink component={Link} to="/shop" underline="hover" color="inherit">Shop</MuiLink>
        {product.category && (
          <MuiLink
            component={Link}
            to={`/shop?category=${product.category.slug}`}
            underline="hover"
            color="inherit"
          >
            {product.category.name}
          </MuiLink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, md: 6 }}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#f5f5f5',
              aspectRatio: '4/5',
            }}
          >
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {discount > 0 && (
              <Chip
                label={`-${discount}%`}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  bgcolor: 'secondary.main',
                  fontWeight: 700,
                }}
              />
            )}
          </Box>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {product.category?.name}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5, mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={Number(product.rating)} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {product.rating} ({product.review_count} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ${price.toFixed(2)}
            </Typography>
            {original && original > price && (
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${original.toFixed(2)}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            {product.description}
          </Typography>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, mb: 3, flexWrap: 'wrap' }}>
              {product.tags.map((t) => (
                <Chip key={t} label={t} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Size */}
          {product.sizes?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Size
              </Typography>
              <ToggleButtonGroup
                value={size}
                exclusive
                onChange={(_, v) => v && setSize(v)}
                size="small"
              >
                {product.sizes.map((s) => (
                  <ToggleButton key={s} value={s} sx={{ px: 2, minWidth: 48 }}>
                    {s}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Color */}
          {product.colors?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Color: {color}
              </Typography>
              <ToggleButtonGroup
                value={color}
                exclusive
                onChange={(_, v) => v && setColor(v)}
                size="small"
              >
                {product.colors.map((c) => (
                  <ToggleButton key={c} value={c} sx={{ px: 2 }}>
                    {c}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Quantity */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                size="small"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <Minus size={16} />
              </IconButton>
              <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }}>
                {quantity}
              </Typography>
              <IconButton
                onClick={() => setQuantity((q) => q + 1)}
                size="small"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <Plus size={16} />
              </IconButton>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingBag size={18} />}
              onClick={handleAdd}
              disabled={!product.in_stock || adding}
              sx={{ flex: 1, minWidth: 180, py: 1.5 }}
            >
              {product.in_stock ? (adding ? 'Adding...' : 'Add to Cart') : 'Sold Out'}
            </Button>
            <IconButton
              onClick={handleWishlist}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                width: 52,
                height: 52,
              }}
            >
              <Heart
                size={20}
                fill={inWishlist ? '#d32f2f' : 'none'}
                color={inWishlist ? '#d32f2f' : '#1a1a1a'}
              />
            </IconButton>
          </Box>

          {!product.in_stock && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              This item is currently out of stock.
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Related */}
      {related.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            You may also like
          </Typography>
          <Grid container spacing={2.5}>
            {related.map((p) => (
              <Grid item xs={6} sm={4} md={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
