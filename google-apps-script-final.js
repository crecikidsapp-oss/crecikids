/**
 * CreciKids Email Collection - Versión funcional completa
 * ✅ Compatible con Google Apps Script Web App
 * ✅ Guarda emails en una hoja "Emails_Registrados"
 * ✅ Incluye prueba manual y endpoint GET/POST
 */

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: '✅ CreciKids API funcionando correctamente',
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: '❌ No se recibieron datos POST válidos'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Analizar el cuerpo del POST
    const data = JSON.parse(e.postData.contents);
    const email = data.email ? data.email.trim() : '';

    if (!email) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: '⚠️ El campo "email" es obligatorio'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Guardar el correo
    const result = saveEmail(email);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: '✅ Email guardado exitosamente',
        data: result
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: '❌ Error en doPost: ' + error.message
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Guarda el email en la hoja
 */
function saveEmail(email) {
  const SPREADSHEET_ID = '17UKmRuI-xI5odkZeezxG2I51Xa8vA4O9K7HtnioqQmk'; // tu ID
  const SHEET_NAME = 'Emails_Registrados';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let hoja = ss.getSheetByName(SHEET_NAME);
  if (!hoja) {
    hoja = ss.insertSheet(SHEET_NAME);
    hoja.appendRow(['Email', 'Fecha_Registro']); // encabezados
    const header = hoja.getRange(1, 1, 1, 2);
    header.setBackground('#FF8C00');
    header.setFontColor('#FFFFFF');
    header.setFontWeight('bold');
  }

  const fecha = new Date();
  const data = hoja.getDataRange().getValues();
  const emails = data.slice(1).map(r => r[0]);

  // Verifica si el email ya existe
  if (emails.includes(email)) {
    return { email, message: 'El email ya estaba registrado', fecha: fecha.toISOString() };
  }

  hoja.appendRow([email, fecha]);
  return { email, fecha: fecha.toISOString(), fila: hoja.getLastRow(), hoja: SHEET_NAME };
}

/**
 * Ejecutar manualmente desde el editor para probar
 */
function pruebaGuardarDatos() {
  const emailPrueba = 'prueba@crecikids.com';
  const resultado = saveEmail(emailPrueba);
  Logger.log('✅ Prueba ejecutada correctamente:');
  Logger.log(resultado);
  SpreadsheetApp.getUi().alert('✅ Prueba ejecutada. Revisa tu hoja de cálculo.');
  return resultado;
}