import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const adCreative = searchParams.get('adCreative') || '';
  return handleRequest(url, adCreative);
}

export async function POST(req) {
  try {
    const { url, adCreative } = await req.json();
    return handleRequest(url, adCreative || '');
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

async function handleRequest(url, adCreative) {
  try {

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Fetch the original landing page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch the URL' },
        { status: response.status }
      );
    }

    const htmlUrl = new URL(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // 2. Inject a <base> tag to ensure relative assets (images, css, links) work correctly
    if ($('head').length === 0) {
      $('html').prepend('<head></head>');
    }
    
    // Inject History API mocks so modern routers (Next.js, React Router) don't crash
    // when trying to replaceState with the base href cross-origin.
    const mockScript = `
      <script>
        // Prevent SecurityError: Failed to execute 'replaceState' on 'History'
        const originalReplaceState = window.history.replaceState;
        const originalPushState = window.history.pushState;
        window.history.replaceState = function() {};
        window.history.pushState = function() {};
      </script>
    `;
    
    // Check if base tag already exists, if so modify it, otherwise prepend
    if ($('base').length) {
      $('base').attr('href', htmlUrl.origin);
      $('head').prepend(mockScript);
    } else {
      $('head').prepend(`<base href="${htmlUrl.origin}/">`);
      $('head').prepend(mockScript);
    }

    // Remove crossorigin attribute to prevent CORS failures when loading in srcDoc iframe
    $('[crossorigin]').removeAttr('crossorigin');

    // Attempt to inject absolute URLs for forms to prevent submission to proxy
    $('form').each(function () {
      const action = $(this).attr('action');
      if (action && !action.startsWith('http')) {
        try {
          $(this).attr('action', new URL(action, htmlUrl.origin).href);
        } catch (e) {
          // ignore invalid urls
        }
      }
    });

    // 3. Extract logic (Mock LLM) 
    // We intentionally DO NOT modify the HTML tree with Cheerio here.
    // Modifying the server HTML directly causes Next.js/React hydration crashes 
    // (the browser expects the HTML to match its Javascript state exactly on first load).
    // Instead, we inject a client-side script to manipulate the DOM *after* hydration.

    const clientScript = `
      <script>
        // Wait for React to mount and hydrate completely
        window.addEventListener('load', () => {
          setTimeout(() => {
            const h1s = document.querySelectorAll('h1');
            h1s.forEach(el => {
              if (!el.innerText.includes('🚀')) {
                el.innerText = '🚀 ' + el.innerText + ' (Optimized for: ${adCreative.replace(/'/g, "\\'").substring(0, 20)}...)';
                el.style.border = '2px solid #3b82f6';
                el.style.position = 'relative';
              }
            });
            const h2s = document.querySelectorAll('h2');
            h2s.forEach(el => {
              if (!el.innerText.includes('✨')) {
                el.innerText = '✨ ' + el.innerText + ' - Discover more!';
                el.style.border = '2px solid #3b82f6';
                el.style.position = 'relative';
              }
            });
            
            const btns = document.querySelectorAll('.btn, button, a[class*="button"]');
            btns.forEach(el => {
                const txt = el.innerText.toLowerCase();
                if (txt.includes('click') || txt.includes('learn') || txt.includes('get') || txt.includes('start')) {
                    el.innerText = 'Claim Your Offer Now!';
                    el.style.border = '2px solid #3b82f6';
                }
            });
          }, 1500); // Wait 1.5s for initial hydration to finish
        });
      </script>
    `;
    $('body').append(clientScript);

    // 4. Return the modified HTML
    const modifiedHtml = $.html();
    
    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // 'Content-Security-Policy': "frame-ancestors 'self'", // allow framing only from our domain
      },
    });

  } catch (error) {
    console.error('Error personalizing page:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
