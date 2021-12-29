# Developer Guidelines

* When using entity constants in files within the `/shared` or `/web-api` directory, directly import them at the top of the file. When using them in files within the `/web-client` directory, retrieve them using `applicationContext.getConstants()`.
