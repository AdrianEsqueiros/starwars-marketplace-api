
# Star Wars Marketplace API

Este proyecto es un backend desarrollado con **NestJS** y desplegado en **AWS Lambda** usando **Serverless Framework**. Su objetivo es integrar datos de personajes de **Star Wars** (a través de SWAPI) con productos de **MercadoLibre**, almacenando y gestionando esta información en **DynamoDB**.

---
API Desplegada: https://8gy1bdyg6b.execute-api.us-east-1.amazonaws.com/dev/swagger

## Características

- **NestJS** como framework backend.
- **AWS Lambda** y **Serverless Framework** para arquitectura serverless.
- **Integración de APIs**:
  - SWAPI para obtener datos de personajes de Star Wars.
  - MercadoLibre para buscar productos relacionados.
- **DynamoDB** como base de datos NoSQL para almacenamiento y caché.
- **Swagger** para documentación de API.
- **TypeScript** para tipado estático y mayor seguridad en el código.
- **Pruebas Unitarias e Integración** con Jest.
- **Despliegue en AWS** mediante Serverless Framework.

---

## Puntos Mínimos Obligatorios del MVP

Este proyecto cumple con los siguientes puntos mínimos del MVP:
1. **Pruebas unitarias y de integración** utilizando Jest.
2. **Uso de TypeScript** para tipado estático.
3. **Endpoints desarrollados**:
   - Un **GET** que combina datos de las APIs externas de SWAPI y MercadoLibre.
   - Un **POST** para almacenar recursos en la base de datos.
   - Un **GET** para consultar el historial de datos almacenados.
4. **Cacheo de resultados** para evitar múltiples llamadas a las APIs dentro de un intervalo de 30 minutos.
5. **Despliegue en AWS** utilizando Serverless Framework.
6. **Almacenamiento en DynamoDB**.
7. Uso de **AWS Lambda y API Gateway** como infraestructura serverless.

---
## Puntos Bonus

El proyecto incluye los siguientes puntos bonus:

1.**Autenticación para proteger los endpoints POST y GET /historial con JWT**:
   - Se protegieron las rutas con jwt.

2. **Documentación de los endpoints con Swagger/OpenAPI**:
   - Swagger se encuentra disponible en `https://8gy1bdyg6b.execute-api.us-east-1.amazonaws.com/dev/swagger`.

3. **Uso de logging avanzado con AWS CloudWatch**:
   - Los logs de errores y rendimiento se almacenan en AWS CloudWatch para facilitar la trazabilidad y el monitoreo.

4. **Implementación de un sistema de rate-limiting**:
   - Limita el número de solicitudes a los endpoints, previniendo el abuso de las APIs externas mediante la integración de `@nestjs/throttler`.

---

## Pruebas con Gherkin

A continuación, se presenta un ejemplo de caso de uso descrito en lenguaje Gherkin para las pruebas del endpoint `/fusionados`:

### Escenario: Obtener datos fusionados de Star Wars y MercadoLibre
```gherkin
Feature: Obtener datos fusionados
  Como un usuario
  Quiero consultar datos de personajes de Star Wars y productos relacionados de MercadoLibre
  Para visualizar información combinada.

  Scenario: Consultar datos exitosamente
    Given el servicio está disponible
    And los datos de SWAPI y MercadoLibre están accesibles
    When el usuario envía una solicitud GET a "/fusionados"
    Then el sistema debe responder con un código 200
    And la respuesta debe incluir una lista de personajes y sus productos relacionados.
```
---
## Endpoints de la API

### General
- **GET `/`**: Responde con un mensaje básico `"Hello World!"`.

### Datos Fusionados
- **GET `/fusionados`**: Combina y devuelve datos de SWAPI y MercadoLibre.
  - **Query Parameters**:
    - `country` (opcional): País para buscar en MercadoLibre (default: `Peru`).
    - `characterPage` (opcional): Página de personajes de SWAPI (default: `1`).
    - `productPage` (opcional): Página de productos de MercadoLibre (default: `1`).
    - `productLimit` (opcional): Límite de productos por personaje (default: `5`).

### Crear Datos
- **POST `/almacenar`**: Almacena datos fusionados de un personaje y sus productos.

### Historial
- **GET `/historial`**: Consulta datos almacenados.
  - **Query Parameters**:
    - `limit` (opcional): Límite de registros.
    - `pageNumber` (opcional): Número de página.
    - `sortKey` (opcional): Clave para ordenar.
    - `sortOrder` (opcional): Orden (`ASC` o `DESC`).

---

## Instalación

1. Clona el repositorio:


2. Cambia al directorio del proyecto:

   ```bash
   cd starwars-marketplace-api
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

---

## Despliegue

### Localmente
Ejecuta el servidor de manera local con `Serverless Offline`:

```bash
serverless offline
```

### En AWS
1. Configura tus credenciales de AWS:
   ```bash
   aws configure
   ```

2. Despliega el proyecto en AWS Lambda:
   ```bash
   serverless deploy
   ```

---

## Documentación de Swagger

Accede a la documentación de Swagger en:  
`http://localhost:3000/dev/swagger`

---

## Base de Datos

### Tablas DynamoDB
1. **`StarWarsMarketplace`**:
   - Clave primaria: `cacheKey` (string).
   - Uso: Almacén temporal para datos fusionados.

2. **`StarWarsMarketplaceHistory`**:
   - Clave primaria: `timestamp` (número).
   - Uso: Registro histórico de datos.

### Modelo de Escalabilidad
Ambas tablas están configuradas con `PAY_PER_REQUEST` para escalabilidad automática.

---

## Pruebas

Ejecuta las pruebas unitarias con el siguiente comando:

```bash
npm run test
```

---

## Arquitectura

### **Controladores**
- `StarWarsMarketplaceController`: Maneja las solicitudes HTTP.

### **Servicios**
- `StarWarsService`: Consume la API SWAPI.
- `MercadoLibreService`: Consume la API de MercadoLibre.
- `StarWarsMarketplaceService`: Lógica de negocio central.

### **Repositorios**
- `StarWarsMarketplaceRepository`: Gestiona la caché.
- `RecordRepository`: Gestiona el historial de datos.

---
