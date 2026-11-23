import { createServer } from 'node:http';

const links = Array.from({ length: 10 }, (_, i) => i + 1);
const noisyRecording = process.argv[2] === 'noisy';
createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(`<!doctype html><title>Replay anchor repro</title>
    <nav>${links.map(i => `<a href="#section-${i}">${noisyRecording ? 'Initial' : 'Ready'} section ${i}</a>`).join(' ')}</nav>
    <label>Item name <input></label>
    <button type="button">Fill draft</button>
    <script>
      document.querySelector('button').onclick = () => {
        document.querySelector('input').value = 'Example draft';
        document.querySelectorAll('nav a').forEach((link, i) => {
          link.textContent = 'Ready section ' + (i + 1);
        });
      };
    </script>`);
}).listen(4179, '127.0.0.1');
