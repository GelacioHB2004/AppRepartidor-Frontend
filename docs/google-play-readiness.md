# Expediente de publicación en Google Play

## Datos básicos

- Nombre: Dulcería Angelitos Repartidores
- Tipo: Aplicación
- Categoría: Empresa
- Precio: Gratuita
- Anuncios: No contiene anuncios
- Público objetivo: Personas mayores de 18 años; repartidores autorizados
- Paquete Android: `com.gelaciohb2004.apprepartidor`

## URLs públicas

- Política de privacidad: `https://gelaciohb2004.github.io/AppRepartidor-Frontend/privacy-policy.html`
- Eliminación de cuenta: `https://gelaciohb2004.github.io/AppRepartidor-Frontend/account-deletion.html`

## Acceso para revisión

La aplicación requiere inicio de sesión. Crear una cuenta de demostración activa y reutilizable que:

- no requiera OTP ni aprobación adicional;
- no expire durante la revisión;
- tenga al menos un pedido asignado y registros de historial;
- pueda abrir perfil, pedidos, historial, políticas y flujo de evidencia;
- no contenga datos reales de clientes.

Texto sugerido para Play Console:

> Sign in with the reusable demo account provided below. No OTP or additional approval is required. The account has synthetic delivery data for reviewing dashboard, orders, delivery evidence, history, profile, privacy policy, and account deletion. Camera and precise foreground location are requested only after the reviewer opens an assigned order and chooses to confirm delivery.

No guardar usuario o contraseña de revisión en Git ni en este documento. Capturarlos únicamente en Play Console.

## Declaración de ubicación precisa

Función: comprobación puntual del lugar de entrega.

Texto sugerido:

> AppRepartidor uses precise foreground location only when an authorized delivery worker taps “Obtener mi ubicación” while confirming an assigned delivery. The coordinates are attached to the delivery evidence to verify that the order was completed at the destination and to resolve delivery disputes. The app does not access location in the background, does not perform continuous tracking, and does not use location for advertising or analytics. Approximate location is insufficient because it can represent an area spanning several kilometers and cannot reliably demonstrate that the worker was at the delivery address.

## Seguridad de datos: declaración preliminar

Revisar en Play Console según la versión final:

- Datos personales: nombre, correo electrónico, teléfono e identificador de usuario.
- Ubicación: ubicación precisa.
- Fotos: fotografía de evidencia de entrega.
- Actividad de la app: interacciones operativas con pedidos e historial.
- Finalidades: funcionalidad de la aplicación, administración de cuenta, seguridad y prevención de fraude.
- Cifrado en tránsito: Sí, mediante HTTPS.
- Eliminación: Sí, dentro de la app y mediante URL pública.
- Venta de datos: No.
- Publicidad: No.
- Compartición: evaluar proveedores que actúan como encargados del tratamiento conforme a los contratos aplicables.

## Lista previa al AAB final

- Confirmar que la URL de API corresponde al backend activo.
- Ejecutar pruebas unitarias y TypeScript.
- Probar eliminación con una cuenta sintética, nunca con una cuenta real.
- Confirmar API 36 y `versionCode` superior al último cargado.
- Generar un AAB nuevo después de fusionar frontend y backend.
- Preparar icono 512 x 512, gráfico destacado 1024 x 500 y capturas reales.
