import { redirectUrlService } from './redirect-url.service.js';
import logger from '../../utils/logger.js';
import config from '../../config/env.js';

export async function redirectUrl(req, res, next) {
	try {
		const { shortCode } = req.params || {};
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const userAgent = req.headers['user-agent'];
		const referrer = req.headers['referer'] || req.headers['referrer'] || null;
		
		logger.info('[URL]', 'Redirect Request', { method: req.method, route: req.originalUrl, shortCode });

		if (!shortCode) {
			const err = new Error('Not Found');
			err.statusCode = 404;
			return next(err);
		}

		const result = await redirectUrlService(shortCode, ip, userAgent, referrer);

		if (result.passwordRequired) {
			const acceptHeader = req.headers.accept || '';
			if (acceptHeader.includes('text/html')) {
				return res.redirect(302, `${config.frontendUrl}/protected/${shortCode}`);
			}
			return res.status(401).json({
				success: false,
				message: 'Password required',
				data: {
					passwordRequired: true,
					shortCode: result.shortCode,
				},
			});
		}

		return res.redirect(302, result.originalUrl);
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}

function getPasswordPageHTML(shortCode) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Protected Link - Katomaran</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-slate-900: #0f172a;
      --color-slate-950: #020617;
      --color-cyan-400: #22d3ee;
      --color-cyan-300: #67e8f9;
      --color-rose-400: #f87171;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: radial-gradient(circle at top right, rgba(34, 211, 238, 0.03), transparent 40%), var(--color-slate-950);
      color: #f8fafc;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
      overflow: hidden;
    }
    .container {
      width: 100%;
      max-width: 440px;
      perspective: 1000px;
    }
    .card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 0 25px 50px -12px rgba(2, 6, 23, 0.5);
      animation: slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      padding: 0.375rem 0.75rem;
      margin-bottom: 1.25rem;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-cyan-400);
      box-shadow: 0 0 10px var(--color-cyan-400);
    }
    .badge-text {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
    }
    .icon-wrapper {
      width: 56px;
      height: 56px;
      margin: 0 auto 1.25rem;
      display: grid;
      place-items: center;
      border-radius: 16px;
      background: rgba(34, 211, 238, 0.08);
      border: 1px solid rgba(34, 211, 238, 0.2);
      color: var(--color-cyan-400);
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.05);
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .form-group {
      margin-bottom: 1.25rem;
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      display: flex;
      align-items: center;
    }
    input[type="password"] {
      width: 100%;
      background: #020617;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      color: #ffffff;
      font-size: 0.95rem;
      outline: none;
      transition: all 200ms ease;
    }
    input[type="password"]:focus {
      border-color: rgba(34, 211, 238, 0.5);
      box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.15);
    }
    .error-box {
      display: none;
      align-items: center;
      gap: 0.5rem;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      margin-bottom: 1.25rem;
      color: var(--color-rose-400);
      font-size: 0.85rem;
    }
    .error-box.show {
      display: flex;
      animation: shake 300ms ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-4px); }
      40%, 80% { transform: translateX(4px); }
    }
    button {
      width: 100%;
      background: var(--color-cyan-400);
      color: var(--color-slate-950);
      border: none;
      border-radius: 14px;
      padding: 0.875rem;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 200ms ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    button:hover {
      background: var(--color-cyan-300);
      transform: translateY(-1px);
    }
    button:active {
      transform: translateY(1px);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .spinner {
      display: none;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(2, 6, 23, 0.2);
      border-radius: 50%;
      border-top-color: var(--color-slate-950);
      animation: spin 600ms linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .footer-text {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.75rem;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="badge">
          <div class="badge-dot"></div>
          <div class="badge-text">Smart Link Security</div>
        </div>
        
        <div class="icon-wrapper">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        
        <h1>Link is Protected</h1>
        <p class="subtitle">Enter the password to access this destination.</p>
      </div>

      <div id="error-message" class="error-box">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span id="error-text">Incorrect password. Please try again.</span>
      </div>

      <form id="password-form" onsubmit="handleSubmit(event)">
        <div class="form-group">
          <div class="input-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <input type="password" id="password-input" placeholder="Password" required autofocus autocomplete="current-password">
        </div>

        <button type="submit" id="submit-btn">
          <span id="btn-text">Unlock Link</span>
          <div id="btn-spinner" class="spinner"></div>
        </button>
      </form>

      <p class="footer-text">Protected by Katomaran Security</p>
    </div>
  </div>

  <script>
    async function handleSubmit(event) {
      event.preventDefault();
      
      const input = document.getElementById('password-input');
      const button = document.getElementById('submit-btn');
      const btnText = document.getElementById('btn-text');
      const spinner = document.getElementById('btn-spinner');
      const errorBox = document.getElementById('error-message');
      const errorText = document.getElementById('error-text');
      
      const password = input.value;
      const shortCode = "${shortCode}";
      
      errorBox.classList.remove('show');
      button.disabled = true;
      btnText.style.display = 'none';
      spinner.style.display = 'block';
      
      try {
        const response = await fetch('/api/urls/verify-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ shortCode, password })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          window.location.href = result.data.originalUrl;
        } else {
          errorText.innerText = result.message || 'Verification failed';
          errorBox.classList.add('show');
          button.disabled = false;
          btnText.style.display = 'block';
          spinner.style.display = 'none';
          input.focus();
        }
      } catch (err) {
        errorText.innerText = 'Unable to connect to the server. Please try again.';
        errorBox.classList.add('show');
        button.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
        input.focus();
      }
    }
  </script>
</body>
</html>`;
}

