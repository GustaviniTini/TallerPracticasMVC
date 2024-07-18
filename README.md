# TallerPracticas
 
Principios SOLID
Principio de Responsabilidad Única (SRP)
Descripción:
El principio de responsabilidad única establece que una clase o módulo debe tener una única razón para cambiar, es decir, debe tener una sola responsabilidad.

Aplicación en el Proyecto:
Inicialmente, la lógica de negocio y la lógica de manejo de rutas estaban mezcladas en los mismos archivos, lo que hacía el código difícil de mantener y probar. Para adherirnos al principio SRP, separamos la lógica de negocio en archivos de servicios dedicados y dejamos la lógica de manejo de rutas en los archivos de rutas.

Archivos Modificados:

Antes:
routes/agent.js
routes/map.js
routes/player.js
routes/match.js
Después:
services/agentService.js
services/mapService.js
services/playerService.js
services/matchService.js
Beneficios:

Modularidad: Cada archivo tiene una única función, lo que facilita su comprensión y mantenimiento.
Reutilización: La lógica de negocio puede ser reutilizada en diferentes partes de la aplicación sin duplicar código.
Pruebas: La separación facilita las pruebas unitarias de la lógica de negocio de manera aislada, mejorando la calidad del código.
Patrones de Diseño
Patrón Singleton para la Conexión a la Base de Datos
Descripción:
El patrón Singleton garantiza que una clase tenga solo una instancia y proporciona un punto de acceso global a esa instancia.

Aplicación en el Proyecto:
La conexión a la base de datos se manejaba directamente en el archivo principal de la aplicación (app.js), lo que podía causar múltiples instancias de conexión y dificultaba la gestión centralizada. Implementamos una clase Singleton para manejar la conexión a la base de datos, asegurando que solo haya una única instancia a lo largo del ciclo de vida de la aplicación.

Archivos Modificados:

Nuevo Archivo:
config/database.js
Modificación en:
app.js
Beneficios:

Eficiencia: Se evita la sobrecarga de múltiples conexiones a la base de datos.
Simplicidad: La gestión de la conexión está centralizada, facilitando su mantenimiento y modificación futura.
Consistencia: Toda la aplicación utiliza la misma conexión a la base de datos.
Patrón Factory para la Creación de Objetos
Descripción:
El patrón Factory proporciona una interfaz para crear objetos en una superclase, pero permite que las subclases alteren el tipo de objetos que se crearán.

Aplicación en el Proyecto:
La creación de objetos Agent, Player y Map se realizaba directamente en los servicios, haciendo que el código fuera menos modular y más difícil de mantener y extender. Implementamos fábricas para encapsular la lógica de creación de estos objetos.

Archivos Modificados:

Nuevos Archivos:
factories/AgentFactory.js
factories/PlayerFactory.js
factories/MapFactory.js
Modificación en:
services/agentService.js
services/playerService.js
services/mapService.js
Beneficios:

Modularidad: La lógica de creación de objetos está separada, facilitando el mantenimiento y la comprensión del código.
Extensibilidad: Si en el futuro se necesitan cambios en la forma de crear objetos, solo se necesita modificar la fábrica correspondiente.
Reutilización: Las fábricas pueden ser reutilizadas en diferentes partes de la aplicación, evitando la duplicación de código.
