const { Builder, By, Key, until } = require("selenium-webdriver");

// Funcion para saber el cambio de URL
async function mostrarUrlActual(driver, mensaje = "URL actual del navegador") {
  const nuevaURL = await driver.getCurrentUrl();
  console.log(`🔎 ${mensaje}: ${nuevaURL}`);
  return nuevaURL;
}

async function realizarPrueba() {
  // Driver para Chrome
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navegar a la URL
    await driver.get("https://www.mercadolibre.com/");
    await driver.manage().window().maximize();
    // Selector del pais Mexico
    // Espera a que aparezca
    await driver.wait(
      until.elementLocated(By.xpath("//a[@id='MX']")),
      5000,
      "El Pais no aparece otardo demasiado"
    );

    // Localiza el elemento y da clicl
    await driver.findElement(By.xpath("//a[@id='MX']")).click();

    // Verificar cambio de dominio
    await driver.wait(until.urlContains(".com.mx"), 5000);
    await mostrarUrlActual(driver, "Se selecciono el pais Mexico");

    //Localiza la barra de busqueda
    await driver.wait(
      until.elementLocated(By.xpath("//input[@id='cb1-edit']")),
      5000,
      "Tardo demasiado"
    );
    // Coloca la frase "playstation 5" y se oprime enter
    await driver
      .findElement(By.xpath("//input[@id='cb1-edit']"))
      .sendKeys("playstation 5", Key.ENTER);

    // Esperar a que la URL cambie
    await mostrarUrlActual(driver, "Se busco playstation 5");

    // Filtrar por Condicion: Nuevo
    await driver
      .findElement(
        By.xpath(
          "(//div[contains(@class, 'ui-search-filter-dl')][5]//ul)[1]/li[1]/a"
        )
      )
      .click();

    // Hacer scroll a la pantalla hasta que aparezac un componente
    const filtro = await driver.findElement(
      By.xpath(
        "(//div[contains(@class, 'ui-search-filter-dl')][11]//ul)[1]/li[1]/a"
      )
    );
    await driver.executeScript("arguments[0].scrollIntoView(true)", filtro);
    await filtro.click();

    // Ordenar de mayor a menor
    // Esperar a qeu se muestre el boton
    await driver.wait(
      until.elementLocated(By.xpath("//button[@id=':Rlilie:-trigger']")),
      5000
    );
    await driver
      .findElement(By.xpath("//button[@id=':Rlilie:-trigger']"))
      .click();
    // Elegir la opcion de mayor
    await driver.wait(
      until.elementLocated(
        By.xpath("(//li[@id=':Rlilie:-menu-list-option-price_desc'])[1]")
      ),
      5000
    );
    await driver
      .findElement(
        By.xpath("(//li[@id=':Rlilie:-menu-list-option-price_desc'])[1]")
      )
      .click();

    // Elegir la opcion de menor
    await driver
      .findElement(By.xpath("//button[@id=':Rlilie:-trigger']"))
      .click();
    await driver
      .findElement(
        By.xpath("(//li[@id=':Rlilie:-menu-list-option-price_asc'])[1]")
      )
      .click();
    await mostrarUrlActual(driver, "Productos ordenados Menor precio");

    // Obtener lista de productos
    const listaProductos = await driver.findElements(
      By.xpath("//ol[contains(@class, 'ui-search-layout--stack')]/li")
    );

    const resultados = [];

    // Imprimir los primeros 5 productos
    for (let i = 0; i < 5; i++) {
      const producto = listaProductos[i];

      // XPath relativos para el Nombre/Título usando <a>
      const tituloXpath = ".//a[contains(@class, 'poly-component__title')]";

      // XPath para el Precio
      const precioXpath =
        ".//div[@class='poly-price__current']//span[@class='andes-money-amount__fraction']";

      let nombre = "N/A";
      let precio = "N/A";

      // --- Extraer Nombre ---
      try {
        const tituloElemento = await producto.findElement(
          By.xpath(tituloXpath)
        );
        nombre = await tituloElemento.getText();
      } catch (e) {
        nombre = "Título no encontrado";
      }

      // --- Extraer Precio ---
      try {
        const precioElemento = await producto.findElement(
          By.xpath(precioXpath)
        );
        precio = await precioElemento.getText();
      } catch (e) {
        precio = "Precio actual no encontrado";
      }

      resultados.push({
        numero: i + 1,
        nombre: nombre.trim(),
        // Se limpa el dato para qeu solo qeude el valor
        precio: precio.trim().replace(/,/g, ""),
      });
    }

    // Mostrar los resultados
    console.log("\n=======================================");
    console.log("       TOP 5 PRODUCTOS EXTRAÍDOS       ");
    console.log("=======================================");
    resultados.forEach((r) => {
      console.log(`${r.numero}. ${r.nombre}`);
      console.log(`   Precio: $${r.precio}`);
    });
    console.log("=======================================\n");
  } catch (error) {
    console.error("Ocurrió un error:", error);
  } finally {
    // Cierra el navegador al finalizar
    await driver.quit();
  }
}

realizarPrueba();
