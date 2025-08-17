import { useEffect, useState, useCallback } from "react";
import { listProducts, createProduct, patchProductStock, updateProduct, deleteProduct } from "../api/products.js";
import { MOCK_ITEMS } from "../utils/constants.js";

export default function useProducts(initialItems = MOCK_ITEMS) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listProducts().catch(() => null);
        if (!cancelled && Array.isArray(data) && data.length) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const addProduct = useCallback(async (product) => {
    // Optimistic update
    setItems(prev => [product, ...prev]);
    try {
      await createProduct(product);
    } catch (err) {
      console.error("createProduct failed, keeping local state", err);
      setError(err);
    }
  }, []);

  const changeStock = useCallback(async (productId, payload) => {
    setItems(prev => prev.map(it => it.id === productId ? { ...it, ...payload } : it));
    try {
      await patchProductStock(productId, payload);
    } catch (err) {
      console.error("patchProductStock failed", err);
      setError(err);
    }
  }, []);

  const saveProduct = useCallback(async (productId, product) => {
    setItems(prev => prev.map(it => it.id === productId ? { ...it, ...product } : it));
    try {
      await updateProduct(productId, product);
    } catch (err) {
      console.error("updateProduct failed", err);
      setError(err);
    }
  }, []);

  const removeProduct = useCallback(async (productId) => {
    const prev = items;
    setItems(prev.filter(it => it.id !== productId));
    try {
      await deleteProduct(productId);
    } catch (err) {
      console.error("deleteProduct failed, reverting", err);
      setError(err);
      setItems(prev); // revert
    }
  }, [items]);

  return { items, setItems, loading, error, addProduct, changeStock, saveProduct, removeProduct };
}


