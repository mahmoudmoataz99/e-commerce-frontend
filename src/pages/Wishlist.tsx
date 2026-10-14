import { useEffect } from 'react';
import { Container, Typography, Grid, Skeleton } from '@mui/material';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

export default function Wishlist() {
  const { items, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        Wishlist
      </Typography>

      {isLoading && items.length === 0 ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love by tapping the heart icon on any product."
          actionLabel="Browse Products"
          actionTo="/shop"
        />
      ) : (
        <Grid container spacing={2.5}>
          {items.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.id}>
              <ProductCard product={item.product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
