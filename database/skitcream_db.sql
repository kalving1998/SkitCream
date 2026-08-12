    -- Base de datos SkitCream
    -- Creada con MySQL Workbench

    CREATE DATABASE IF NOT EXISTS skitcream_db;
    USE skitcream_db;

    -- Tabla de usuarios
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de productos
    CREATE TABLE productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        imagen VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de carrito
    CREATE TABLE carrito (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );

    -- Tabla de pedidos
    CREATE TABLE pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        direccion VARCHAR(255) NOT NULL,
        municipio VARCHAR(100) NOT NULL,
        departamento VARCHAR(100) NOT NULL,
        fecha_entrega DATE NOT NULL,
        notas TEXT,
        total DECIMAL(10,2) NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    -- Tabla de items del pedido
    CREATE TABLE pedido_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );

    -- Datos de prueba
    INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES
    ('Torta Red Velvet', 'Bizcocho de cacao con cobertura de queso crema', 65000, 'Tortas', 'red-velvet.jpg'),
    ('Fresas con Crema', 'Fresas frescas bañadas en crema batida', 15500, 'Fresas', 'fresas.jpg'),
    ('Cappuccino', 'Espresso doble con leche vaporizada', 8500, 'Cafes', 'cappuccino.jpg'),
    ('Torta Dos Amores', 'Torta especial de la casa', 68000, 'Tortas', 'dos-amores.jpg');