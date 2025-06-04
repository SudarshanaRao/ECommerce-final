// utils/wishlist-utils.js
import Cookies from "js-cookie";

const COOKIE_KEY = "wishlist_items";

export function getWishlistItems() {
  const cookie = Cookies.get(COOKIE_KEY);
  return cookie ? JSON.parse(cookie) : [];
}

export function addWishlistItem(item) {
  const wishlist = getWishlistItems();
  if (!wishlist.find((i) => i.productId === item.productId)) {
    wishlist.push(item);
    Cookies.set(COOKIE_KEY, JSON.stringify(wishlist), { expires: 7 }); // lasts 7 days
  }
}

export function removeWishlistItem(productId) {
  const wishlist = getWishlistItems().filter((item) => item.productId !== productId);
  Cookies.set(COOKIE_KEY, JSON.stringify(wishlist), { expires: 7 }); // lasts 7 days

}

export function clearWishlist() {
  Cookies.remove(COOKIE_KEY);
}
export function isInWishlist(productId) {
  const wishlist = getWishlistItems();
  return wishlist.some((item) => item.productId === productId);
}

export function toggleWishlistItem(item) {
  const wishlist = getWishlistItems();
  const exists = wishlist.some((i) => i.productId === item.productId);

  if (exists) {
    removeWishlistItem(item.productId);
    return false; // Removed
  } else {
    addWishlistItem(item);
    return true; // Added
  }
}

