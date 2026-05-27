# BookVerse – Tienda de Libros Móvil

Aplicación móvil desarrollada con **React Native + Expo Router** para la gestión y compra de libros en línea, como proyecto de parcial.

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54 |
| Expo Router | ~6 |
| NativeWind / TailwindCSS | ^4.2.3 / 3.4.17 |
| Axios | ^1.15 |
| TanStack React Query | ^5.99 |
| AsyncStorage | 2.2.0 |
| TypeScript | ~5.9 |
| CryptoJS (AES-256-CBC) | ^4.2 |
| Cloudinary (upload de imágenes) | via REST API |

---

## Módulos implementados

### Usuarios
- Registro con rol (buyer / seller)
- Login con JWT + contraseña cifrada (AES-256-CBC)
- Perfil de usuario (ver y editar)
- Gestión de direcciones de envío (crear, editar, eliminar, marcar como principal)

### Productos
- Listado de productos con búsqueda por texto
- Filtros avanzados: precio mínimo/máximo, categoría
- Filtro de favoritos (persistido localmente con AsyncStorage)
- Detalle de producto con imagen, descripción, precio y stock
- Crear producto con subida de imagen a Cloudinary
- Editar producto
- Eliminar producto (solo vendedor)
- Pantalla de categorías literarias

### Compras / Órdenes
- Crear orden de compra (productId, quantity, shippingAddressId)
- Listar mis compras (buyer)
- Cancelar orden (buyer, si está en PENDING o PROCESSING)
- Listar mis ventas (seller)
- Actualizar estado de orden: PENDING → PROCESSING → SHIPPED → DELIVERED (seller)

---

## Endpoints consumidos

### Auth
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registro de usuario |

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users/me` | Datos básicos del usuario |
| GET | `/api/users/me/personal-info` | Info personal |
| PUT | `/api/users/me/personal-info` | Actualizar info personal |
| GET | `/api/users/me/addresses` | Listar direcciones |
| POST | `/api/users/me/addresses` | Crear dirección |
| PUT | `/api/users/me/addresses/:id` | Actualizar dirección |
| DELETE | `/api/users/me/addresses/:id` | Eliminar dirección |

### Productos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products/:id` | Detalle de producto |
| POST | `/api/products` | Crear producto (seller) |
| PUT | `/api/products/:id` | Actualizar producto (seller) |
| DELETE | `/api/products/:id` | Eliminar producto (seller) |

### Órdenes
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/orders` | Crear orden |
| GET | `/api/orders/my` | Mis órdenes |
| GET | `/api/orders/:id` | Detalle de orden |
| PUT | `/api/orders/:id/cancel` | Cancelar orden |
| PUT | `/api/orders/:id/status?status=X` | Actualizar estado |

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```
EXPO_PUBLIC_API_URL=https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=TU_CLOUD_NAME
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=TU_UPLOAD_PRESET
```

---

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar la app
npx expo start

# En Android
npx expo start --android

# En iOS
npx expo start --ios
```

---

## Usuarios de prueba

Registra usuarios directamente desde la app en `/auth/register`:

- **Buyer (comprador):** Elige rol "Comprador"
- **Seller (vendedor):** Elige rol "Vendedor"

---

## Guía de prueba para el profesor (paso a paso)

### Flujo Buyer (Comprador)

1. **Registrar** un usuario con rol Comprador.
2. **Iniciar sesión** → llega al catálogo de libros.
3. **Buscar** un libro por título o autor en la barra de búsqueda.
4. **Tap en "Ver detalle"** de cualquier libro → ver imagen, descripción, precio.
5. Pulsar **corazón** para agregar a favoritos; usar filtro **"Favoritos"** en el catálogo.
6. Ir a **Perfil → Mis direcciones** y crear una dirección de envío.
7. Volver al catálogo, entrar al detalle de un libro y pulsar **"Comprar ahora"**.
8. Seleccionar cantidad y dirección → **Confirmar compra**.
9. Navegar a **"Mis compras"** para ver la orden creada.
10. Si la orden está en PENDING, pulsar **"Cancelar orden"**.

### Flujo Seller (Vendedor)

1. **Registrar** un usuario con rol Vendedor.
2. **Iniciar sesión** → llega al catálogo con botones de vendedor.
3. Pulsar **"+ Crear libro"** → rellenar formulario y subir imagen.
4. En el catálogo, pulsar **"Editar"** en cualquier libro propio.
5. Entrar al **detalle de un libro** y pulsar **"Eliminar libro"**.
6. Navegar a **"Mis ventas"** para ver las órdenes recibidas.
7. Actualizar el estado de una orden: Pendiente → En proceso → Enviado → Entregado.

### Otras funcionalidades

- Ir a **Categorías** para explorar libros por género.
- Usar los **filtros de precio** (mínimo / máximo) en el catálogo.
- Ir a **Perfil** para actualizar nombre, teléfono y fecha de nacimiento.

---

## Estructura del proyecto

```
bookverse-libros-app1/
├── actions/
│   ├── auth/           # login, register, updateProfile
│   ├── orders/         # createOrder, getOrders, getOrderById, cancelOrder, updateOrderStatus
│   ├── products/       # getProducts, createProduct, deleteProduct
│   └── users/          # addresses
├── api/
│   └── ecommerceApi.ts # cliente HTTP con fallback de URLs
├── app/
│   ├── auth/           # login, register
│   ├── products/       # index, [id], create, edit/[id]
│   ├── profile/        # index, addresses
│   └── shopping/       # buyer, seller, categories
├── components/
│   ├── BookCard.tsx    # Tarjeta de libro con favorito y detalle
│   └── BookForm.tsx    # Formulario de crear/editar
├── context/
│   └── AuthContext.tsx
├── interfaces/         # auth, product, order, address
├── services/           # bookMappers, cloudinary
└── utils/              # authStorage, authHelpers, crypto, favoritesStorage
```
