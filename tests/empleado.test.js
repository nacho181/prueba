const assert = require('assert');
const http = require('http');
const app = require('../src/server');

let server;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(3001, resolve));
  console.log('Test server listening on port 3001');

  try {
    // Test 1: Healthcheck
    console.log('Test 1: Healthcheck...');
    const resHealth = await request('GET', '/api/v1/health');
    assert.strictEqual(resHealth.status, 200);
    assert.strictEqual(resHealth.body.status, 'OK');

    // Test 2: Employees list
    console.log('Test 2: Employees list...');
    const resEmp = await request('GET', '/api/v1/usuarios/empleados');
    assert.strictEqual(resEmp.status, 200);
    assert.strictEqual(resEmp.body.status, 'success');
    assert.strictEqual(Array.isArray(resEmp.body.data), true);

    // Test 3: Articles list
    console.log('Test 3: Articles list...');
    const resArt = await request('GET', '/api/v1/articulos');
    assert.strictEqual(resArt.status, 200);
    assert.strictEqual(resArt.body.status, 'success');

    // Test 4: Create incident
    console.log('Test 4: Create incident...');
    const resCreate = await request('POST', '/api/v1/incidencias', {
      id_articulo: 1,
      creado_por: 1,
      prioridad: 2,
      descripcion_pedido: 'El monitor de la PC no da video.'
    });
    assert.strictEqual(resCreate.status, 201);
    assert.strictEqual(resCreate.body.status, 'success');

    // Test 5: List incidents
    console.log('Test 5: List incidents...');
    const resInc = await request('GET', '/api/v1/incidencias/mis-incidencias?id_usuario=1');
    assert.strictEqual(resInc.status, 200);
    assert.strictEqual(resInc.body.status, 'success');

    // Test 6: Cancel incident
    console.log('Test 6: Cancel pending incident...');
    const resCancel = await request('PUT', '/api/v1/incidencias/1/cancelar', { id_usuario: 1 });
    assert.strictEqual(resCancel.status, 200);
    assert.strictEqual(resCancel.body.status, 'success');

    console.log('\n✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
  } catch (err) {
    console.error('\n❌ ERROR EN PRUEBAS:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
