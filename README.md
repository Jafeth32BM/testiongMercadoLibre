# 🤖 Automatización de Prueba en la pagina de **Mercado Libre**

Este proyecto contiene un script de automatización de pruebas (QA Automation) desarrollado con **Selenium WebDriver y JavaScript (Node.js)**. El objetivo es simular la navegación inicial de un usuario en el sitio de Mercado Libre, ingresar al sitio del pais correspondiente, hacer una busqueda de un producto, filtrar por productos nuevos, ordernar de mayor a menor, de menor a mayor y obtener el nombre y precio de los primeros 5 productos.

<br>
<br>

# 🎯 Objetivo de la Prueba

El script realiza los siguientes pasos:

1. ✅ Abre el navegador Chrome y maximiza la ventana.
2. ✅ Navega a la URL principal de **[Mercado Libre](https://www.mercadolibre.com/).**
3. ✅ Seleccionar México como pais.
4. ✅ Buscar el terminó "playstation 5"
5. ✅ Filtrar por condición: "Nuevos"
6. ✅ Filtrar por Locación: "CDMX" (Tuve problemas para encontrar especificamente CDMX por lo que utilice origen del envio 'Local?)
7. ✅ Ordenar por "mayor" a "menor precio"
8. ✅ Obtener el nombre y precio de los primeros 5 productos
9. ✅ Imprimir en consola esos valores

<br>
<br>

# 🛠️ Requisitos Previos

Antes de ejecutar el script, asegúrate de tener instalado lo siguiente:

- **[Node.js y npm:](https://nodejs.org/es/download)** Entorno de ejecución de JavaScript y gestor de paquetes.
  - Verifica la instalación con:
```bash
    node -v
    npm -v
```
- **[Google Chrome:](https://www.google.com/intl/es_es/chrome/)** El navegador utilizado por Selenium para la ejecución.
- **[Mocha](https://www.npmjs.com/package/mocha) y [Mochawesome:](https://www.npmjs.com/package/mochawesome)** esos son necesarios para poder ejecutar el reporte de manera correcta

<br>
<br>

# 🚀 Configuración e Instalación

Para configurar el proyecto en local

1.  Clonar el Repositorio desde el sigiente enlace de _[GitHub](https://github.com/Jafeth32BM/testiongMercadoLibre)_.
    O bien colocando la siguente linea de comando en terminal:
```bash
    git clone https://github.com/Jafeth32BM/testiongMercadoLibre.git
```

2.  Inicializar e Instalar Dependencias
    **Asegúrate de que el archivo package.json exista** (usando `npm init -y`).

3.  Luego, instala las librerías necesarias:
```bash
    npm install selenium-webdriver chromedriver
```

Esto instalará Selenium WebDriver y el ChromeDriver necesario para controlar el navegador Chrome.

<br>
<br>

# ⚙️ Estructura del Proyecto

```
.
├── node_modules/         # Dependencias instaladas por npm
├── reportes/             # Carpeta contenedora de los reportes por Mocha
├── package.json          # Archivo de configuración de Node.js
├── package-lock.json     # Bloqueo de versiones de dependencias
├── mercadolibre.test.ts  # Script para el reporte de ejecucion
└── index.js              # 👈 El script principal de automatización
```

# ▶️ Ejecución de la Prueba

Para ejecutar el script de automatización, abre la terminal en la raíz del proyecto y usa el siguiente comando:

```bash
    node index.js
```

# 🧾 Ejecución para los reportes

De igual manera para ejecutar los reportes de prueba, abre la terminal en la raiz del proyecto y utiliza el siguiente comando:

```bash
    npm test
```

**Autor:** Josephan Jafeth Badillo Martinez <br> **Fecha:** 31-oct-2025
