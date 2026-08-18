import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../components/Firebase";

const sortableDate = (item) => item.createdAt?.toMillis?.() ?? new Date(item.createdAt || item.updatedAt || 0).getTime();
export const sortNewestProducts = (products) => [...products].sort((a, b) => sortableDate(b) - sortableDate(a));

export const listenToProducts = (onData, onError) => onSnapshot(
  collection(db, "products"),
  (snapshot) => onData(sortNewestProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
  onError,
);

export const createProduct = async (values, { status, visibility, images = [] } = {}) => {
  const stock = Number(values.stock || 0);
  const productStatus = status === "Draft" ? "Draft" : (values.status === "Out of Stock" || stock <= 0 ? "Out of Stock" : "Published");
  const record = {
    ...values,
    name: values.name?.trim(),
    sku: values.sku?.trim(),
    price: Number(values.price || 0),
    original_price: Number(values.original_price || 0),
    stock,
    stock_status: stock <= 0 ? "Out of Stock" : "In Stock",
    status: productStatus,
    visibility: visibility || values.visibility || "Public",
    images,
    image: images[0] || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  delete record.imagesInput;
  return addDoc(collection(db, "products"), record);
};

export const updateProduct = (id, values) => {
  const updates = { ...values, updatedAt: serverTimestamp() };
  if (values.stock !== undefined) {
    const s = Math.max(0, Number(values.stock) || 0);
    updates.stock = s;
    if (!values.stock_status) {
      updates.stock_status = s <= 0 ? "Out of Stock" : "In Stock";
    }
  }
  return updateDoc(doc(db, "products", id), updates);
};

export const quickUpdateStock = (id, newStock) => {
  const s = Math.max(0, Number(newStock) || 0);
  return updateDoc(doc(db, "products", id), {
    stock: s,
    stock_status: s <= 0 ? "Out of Stock" : "In Stock",
    updatedAt: serverTimestamp()
  });
};

export const removeProduct = (id) => deleteDoc(doc(db, "products", id));

