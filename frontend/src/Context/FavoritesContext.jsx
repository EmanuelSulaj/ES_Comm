import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Get user from localStorage
  const getUser = useCallback(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async (showLoading = true) => {
    const user = getUser();
    if (!user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }

    try {
      if (showLoading) setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${user.id || user._id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
        setFavoriteIds(new Set(data.map(fav => fav.product?._id || fav.product)));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      if (showLoading) setLoading(false);
      setIsInitialLoad(false);
    }
  }, [getUser]);

  // Check if product is favorited
  const isFavorited = useCallback((productId) => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);

  // Optimistically add to favorites
  const addToFavorites = useCallback(async (productId) => {
    const user = getUser();
    if (!user) {
      alert('Please login to add favorites');
      return false;
    }

    // Optimistic update - update UI immediately
    const wasFavorited = favoriteIds.has(productId);
    if (wasFavorited) return true; // Already favorited

    // Update state immediately
    setFavoriteIds(prev => new Set([...prev, productId]));
    
    // Find product in current favorites or fetch it
    let productToAdd = null;
    const existingFavorite = favorites.find(fav => (fav.product?._id || fav.product) === productId);
    if (existingFavorite?.product) {
      productToAdd = existingFavorite.product;
      setFavorites(prev => [...prev, { user: user.id || user._id, product: productToAdd, _id: `temp-${Date.now()}` }]);
    } else {
      // Fetch product details in background, but don't block UI
      fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`)
        .then(res => res.ok ? res.json() : null)
        .then(product => {
          if (product) {
            setFavorites(prev => {
              // Check if already added by server sync
              const exists = prev.some(fav => (fav.product?._id || fav.product) === productId);
              if (!exists) {
                return [...prev, { user: user.id || user._id, product, _id: `temp-${Date.now()}` }];
              }
              return prev;
            });
          }
        })
        .catch(error => console.error('Error fetching product:', error));
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user._id,
          productId
        })
      });

      if (response.ok) {
        // Sync with server (silent refresh)
        await fetchFavorites(false);
        return true;
      } else {
        // Revert on error
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        setFavorites(prev => prev.filter(fav => (fav.product?._id || fav.product) !== productId));
        const data = await response.json();
        console.error('Error adding favorite:', data.message);
        return false;
      }
    } catch (error) {
      // Revert on error
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      setFavorites(prev => prev.filter(fav => (fav.product?._id || fav.product) !== productId));
      console.error('Error adding favorite:', error);
      return false;
    }
  }, [getUser, favoriteIds, favorites, fetchFavorites]);

  // Optimistically remove from favorites
  const removeFromFavorites = useCallback(async (productId) => {
    const user = getUser();
    if (!user) return false;

    // Optimistic update - update UI immediately
    const wasFavorited = favoriteIds.has(productId);
    if (!wasFavorited) return true; // Already not favorited

    // Store original state for rollback
    const originalFavorites = favorites;
    const originalIds = favoriteIds;

    // Update state immediately
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setFavorites(prev => prev.filter(fav => (fav.product?._id || fav.product) !== productId));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/${user.id || user._id}/${productId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        // Sync with server (silent refresh)
        await fetchFavorites(false);
        return true;
      } else {
        // Revert on error
        setFavorites(originalFavorites);
        setFavoriteIds(originalIds);
        console.error('Error removing favorite');
        return false;
      }
    } catch (error) {
      // Revert on error
      setFavorites(originalFavorites);
      setFavoriteIds(originalIds);
      console.error('Error removing favorite:', error);
      return false;
    }
  }, [getUser, favoriteIds, favorites, fetchFavorites]);

  // Toggle favorite with optimistic updates
  const toggleFavorite = useCallback(async (productId) => {
    if (isFavorited(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  }, [isFavorited, removeFromFavorites, addToFavorites]);

  // Memoize favorite products to prevent unnecessary re-renders
  const favoriteProducts = useMemo(() => {
    return favorites.map(fav => fav.product).filter(Boolean);
  }, [favorites]);

  // Get favorite products (memoized)
  const getFavoriteProducts = useCallback(() => {
    return favoriteProducts;
  }, [favoriteProducts]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading: loading && isInitialLoad, // Only show loading on initial load
        isFavorited,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        getFavoriteProducts,
        refreshFavorites: fetchFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

