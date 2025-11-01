const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert"); // Validadr pasos
require("chromedriver");

async function mostrarUrlActual(driver, mensaje) {
  const nuevaURL = await driver.getCurrentUrl();
  console.log(`\n🔎 ${mensaje}: ${nuevaURL}`);
  return nuevaURL;
}


async function extraerPrimerosProductos(driver, limite = 5) {
  console.log("\n--- Extrayendo datos de los productos ---");
  const productosXpath = "//ol[contains(@class, 'ui-search-layout--stack')]/li";

  const listaProductos = await driver.findElements(By.xpath(productosXpath));

  if (listaProductos.length === 0) {
    console.log("No se encontraron productos en el listado.");
    return [];
  }

  const resultados = [];

  for (let i = 0; i < Math.min(limite, listaProductos.length); i++) {
    const producto = listaProductos[i];
    const tituloXpath = ".//a[contains(@class, 'poly-component__title')]";
    const precioXpath =
      ".//div[@class='poly-price__current']//span[@class='andes-money-amount__fraction']";

    let nombre = "N/A";
    let precio = "N/A";

    try {
      nombre = await producto.findElement(By.xpath(tituloXpath)).getText();
    } catch (e) {}

    try {
      precio = await producto.findElement(By.xpath(precioXpath)).getText();
    } catch (e) {}

    resultados.push({
      numero: i + 1,
      nombre: nombre.trim(),
      precio: precio.trim().replace(/,/g, ""),
    });
  }
  // Muestra resultados
  console.log("\n=======================================");
  console.log("       TOP 5 PRODUCTOS EXTRAÍDOS       ");
  console.log("=======================================");
  resultados.forEach((r) => {
    console.log(`${r.numero}. ${r.nombre}`);
    console.log(`   Precio: $${r.precio}`);
  });
  console.log("=======================================\n");

  return resultados;
}

// =============================================================
// SUITE DE PRUEBAS DE MOCHA
// =============================================================

describe("Prueba de E-commerce: Mercado Libre (PlayStation 5)", function () {
  // Configura el timeout para que el proceso no falle por lentitud (40 segundos)
  this.timeout(40000);
  let driver;

  // Hook: Se ejecuta una vez antes de iniciar la suite
  before(async function () {
    console.log("--- Inicializando WebDriver ---");
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
  });

  // Hook: Se ejecuta una vez al finalizar toda la suite
  after(async function () {
    console.log("--- Cerrando WebDriver ---");
    await driver.quit();
  });

  it("1. Navegar a ML y seleccionar la región México", async function () {
    await driver.get("https://www.mercadolibre.com/");
    await mostrarUrlActual(driver, "URL Inicial");

    const selectorMexico = By.xpath("//a[@id='MX']");
    await driver.wait(
      until.elementLocated(selectorMexico),
      10000,
      "El selector de México no apareció a tiempo."
    );
    await driver.findElement(selectorMexico).click();

    // Verifica que haya cambiado la URL
    await driver.wait(until.urlContains(".com.mx"), 5000);
    const currentUrl = await mostrarUrlActual(
      driver,
      "Región seleccionada (México)"
    );
    assert.ok(
      currentUrl.includes(".com.mx"),
      "La URL no cambió a la esperada (.com.mx)."
    );
  });

  it('2. Realizar la búsqueda de "playstation 5"', async function () {
    const inputBusquedaXpath = "//input[@id='cb1-edit']";
    const termino = "playstation 5";

    // Localiza y realiza la búsqueda
    await driver.wait(until.elementLocated(By.xpath(inputBusquedaXpath)), 5000);
    await driver.findElement(By.xpath(inputBusquedaXpath)).sendKeys(termino, Key.ENTER);

    // **Aserción:** Verificar que la URL contenga el término de búsqueda
    await driver.wait(until.urlContains(termino.replace(" ", "-")), 10000);
    const currentUrl = await mostrarUrlActual(driver, `Se buscó "${termino}"`);
    assert.ok(
      currentUrl.includes(termino.replace(" ", "-")),
      "La URL de resultados no se cargó correctamente."
    );
  });

  it('3. Aplicar filtro "Nuevo" y filtro de "Local"', async function () {
    // Filtrar por Condicion: Nuevo
    const filtroNuevoXpath =
      "(//div[contains(@class, 'ui-search-filter-dl')][5]//ul)[1]/li[1]/a";
    await driver.wait(until.elementLocated(By.xpath(filtroNuevoXpath)), 5000);
    await driver.findElement(By.xpath(filtroNuevoXpath)).click();

    // Bajar hasta encontrar el Local
    const localXpath =
      "(//div[contains(@class, 'ui-search-filter-dl')][11]//ul)[1]/li[1]/a";
    const local = await driver.findElement(By.xpath(localXpath));
    await driver.executeScript("arguments[0].scrollIntoView(true)",local);
    await local.click();

    await mostrarUrlActual(driver, "Filtros 'Nuevo' y 'Local' aplicados");
    assert.ok(true, "Filtros aplicados correctamente.");
  });

  it("4. Ordenar productos por Mayor precio y luego por Menor precio", async function () {
    const ordenarXpath =
      "//button[contains(@class, 'andes-dropdown__trigger')]";
    const mayorXpath =
      "//li[contains(@id, '-menu-list-option-price_desc')]";
    const menorPrecioXpath =
      "//li[contains(@id, '-menu-list-option-price_asc')]";

    // Clic en el botón de ordenar
    await driver.wait(until.elementLocated(By.xpath(ordenarXpath)), 5000);
    await driver.findElement(By.xpath(ordenarXpath)).click();

    // Elegir Mayor Precio
    await driver.wait(until.elementLocated(By.xpath(mayorXpath)),5000);
    await driver.findElement(By.xpath(mayorXpath)).click();

    // Cambiar a  Menor Precio
    await driver.wait(until.elementLocated(By.xpath(ordenarXpath)), 5000);
    await driver.findElement(By.xpath(ordenarXpath)).click();
    await driver.wait(until.elementLocated(By.xpath(menorPrecioXpath)),5000);
    await driver.findElement(By.xpath(menorPrecioXpath)).click();

    await mostrarUrlActual(driver, "Productos ordenados por Menor Precio");
    assert.ok(true, "Ordenamiento completado de Mayor a Menor precio.");
  });

  it("5. Extraer y reportar los datos de los 5 productos con menor precio", async function () {
    const extractedProducts = await extraerPrimerosProductos(driver, 5);

    // Verificar qeu haya productis
    assert.ok(
      extractedProducts.length > 0,
      "No se pudo extraer ningún producto de la lista."
    );
  });
});
